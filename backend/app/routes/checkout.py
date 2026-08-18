from datetime import date
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db

from app.database.models import (
    Customer,
    Product,
    CartItem,
    Transaction
)

from app.database.schema.checkout import (
    CheckoutRequest,
    CheckoutResponse,
    ALLOWED_PAYMENT_METHODS
)


router = APIRouter(
    prefix="/checkout",
    tags=["Checkout"]
)


# ==========================================================
# CHECKOUT
# ==========================================================

@router.post(
    "/{customer_id}",
    response_model=CheckoutResponse
)
def checkout(
    customer_id: int,
    checkout_data: CheckoutRequest,
    db: Session = Depends(get_db)
):

    # ------------------------------------------------------
    # 1. CHECK CUSTOMER
    # ------------------------------------------------------

    customer = db.query(Customer).filter(
        Customer.Customer_ID == customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    # ------------------------------------------------------
    # 2. VALIDATE PAYMENT METHOD
    # ------------------------------------------------------

    if checkout_data.Payment_Method not in ALLOWED_PAYMENT_METHODS:
        raise HTTPException(
            status_code=400,
            detail="Invalid payment method"
        )

    # ------------------------------------------------------
    # 3. GET CUSTOMER CART
    # ------------------------------------------------------

    cart_items = db.query(CartItem).filter(
        CartItem.Customer_ID == customer_id
    ).all()

    if not cart_items:
        raise HTTPException(
            status_code=400,
            detail="Cart is empty"
        )

    # ------------------------------------------------------
    # 4. CHECK PRODUCTS + STOCK + CALCULATE SUBTOTAL
    # ------------------------------------------------------

    total_subtotal = 0.0
    items_count = 0

    # Store products so we don't have to query them again
    cart_products = []

    for cart_item in cart_items:

        product = db.query(Product).filter(
            Product.Product_ID == cart_item.Product_ID
        ).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {cart_item.Product_ID} not found"
            )

        # Check stock
        if product.Stock < cart_item.Quantity:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Not enough stock for "
                    f"{product.Product_Name}"
                )
            )

        # Product subtotal
        item_subtotal = (
            float(product.Price) *
            cart_item.Quantity
        )

        total_subtotal += item_subtotal

        items_count += cart_item.Quantity

        cart_products.append({
            "cart_item": cart_item,
            "product": product,
            "subtotal": item_subtotal
        })

    # ------------------------------------------------------
    # 5. CALCULATE SHIPPING
    # ------------------------------------------------------

    if total_subtotal > 75:
        shipping_charge = 0.0
    else:
        shipping_charge = 6.99

    grand_total = (
        total_subtotal +
        shipping_charge
    )

    # ------------------------------------------------------
    # 6. CREATE TRANSACTIONS
    # ------------------------------------------------------

    allocated_shipping = 0.0

    for index, item_data in enumerate(cart_products):

        cart_item = item_data["cart_item"]
        product = item_data["product"]
        item_subtotal = item_data["subtotal"]

        # --------------------------------------------------
        # DISTRIBUTE SHIPPING BETWEEN TRANSACTIONS
        # --------------------------------------------------

        if shipping_charge == 0:
            item_shipping = 0.0

        elif index == len(cart_products) - 1:
            # Last item gets remaining amount
            # to avoid rounding differences
            item_shipping = round(
                shipping_charge -
                allocated_shipping,
                2
            )

        else:
            # Proportional shipping
            item_shipping = round(
                shipping_charge *
                (item_subtotal / total_subtotal),
                2
            )

            allocated_shipping += item_shipping

        # --------------------------------------------------
        # LINE TOTAL
        # --------------------------------------------------

        line_total = round(
            item_subtotal + item_shipping,
            2
        )

        # --------------------------------------------------
        # CREATE TRANSACTION
        # --------------------------------------------------

        transaction = Transaction(

            Transaction_ID=(
                f"TXN-{uuid4().hex[:12].upper()}"
            ),

            Customer_ID=customer_id,

            Product_ID=product.Product_ID,

            Quantity=cart_item.Quantity,

            Unit_Price=product.Price,

            Subtotal=item_subtotal,

            Discount_Percent=0,

            Discount_Amount=0,

            Shipping_Method=(
                checkout_data.Shipping_Method
            ),

            Shipping_Charge=item_shipping,

            Total_Amount=line_total,

            Payment_Method=(
                checkout_data.Payment_Method
            ),

            Coupon_Code=None,

            Order_Status="Pending",

            Order_Date=date.today(),

            Delivery_Date=None
        )

        db.add(transaction)

        # --------------------------------------------------
        # REDUCE PRODUCT STOCK
        # --------------------------------------------------

        product.Stock -= cart_item.Quantity

    # ------------------------------------------------------
    # 7. CLEAR CART
    # ------------------------------------------------------

    for cart_item in cart_items:
        db.delete(cart_item)

    # ------------------------------------------------------
    # 8. SAVE EVERYTHING
    # ------------------------------------------------------

    db.commit()

    # ------------------------------------------------------
    # 9. RESPONSE
    # ------------------------------------------------------

    return CheckoutResponse(

        message="Checkout completed successfully",

        customer_id=customer_id,

        total_amount=round(
            grand_total,
            2
        ),

        payment_method=(
            checkout_data.Payment_Method
        ),

        items_count=items_count
    )