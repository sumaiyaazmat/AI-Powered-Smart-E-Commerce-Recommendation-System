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
    # 1. Check customer
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
    # 2. Validate payment method
    # ------------------------------------------------------

    if checkout_data.Payment_Method not in ALLOWED_PAYMENT_METHODS:
        raise HTTPException(
            status_code=400,
            detail="Invalid payment method"
        )

    # ------------------------------------------------------
    # 3. Get customer's cart
    # ------------------------------------------------------

    cart_items = db.query(CartItem).filter(
        CartItem.Customer_ID == customer_id
    ).all()

    if not cart_items:
        raise HTTPException(
            status_code=400,
            detail="Cart is empty"
        )

    total_amount = 0
    items_count = 0

    # ------------------------------------------------------
    # 4. Check products and stock
    # ------------------------------------------------------

    for cart_item in cart_items:

        product = db.query(Product).filter(
            Product.Product_ID == cart_item.Product_ID
        ).first()

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {cart_item.Product_ID} not found"
            )

        if product.Stock < cart_item.Quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock for {product.Product_Name}"
            )

        subtotal = float(product.Price) * cart_item.Quantity

        total_amount += subtotal
        items_count += cart_item.Quantity

    # ------------------------------------------------------
    # 5. Create transaction for every cart item
    # ------------------------------------------------------

    for cart_item in cart_items:

        product = db.query(Product).filter(
            Product.Product_ID == cart_item.Product_ID
        ).first()

        subtotal = float(product.Price) * cart_item.Quantity

        transaction = Transaction(
            Transaction_ID=f"TXN-{uuid4().hex[:12].upper()}",

            Customer_ID=customer_id,

            Product_ID=product.Product_ID,

            Quantity=cart_item.Quantity,

            Unit_Price=product.Price,

            Subtotal=subtotal,

            Discount_Percent=0,

            Discount_Amount=0,

            Shipping_Method=checkout_data.Shipping_Method,

            Shipping_Charge=0,

            Total_Amount=subtotal,

            Payment_Method=checkout_data.Payment_Method,

            Coupon_Code=None,

            Order_Status="Pending",

            Order_Date=date.today(),

            Delivery_Date=None
        )

        db.add(transaction)

        # --------------------------------------------------
        # Reduce product stock
        # --------------------------------------------------

        product.Stock -= cart_item.Quantity

    # ------------------------------------------------------
    # 6. Clear cart
    # ------------------------------------------------------

    for cart_item in cart_items:
        db.delete(cart_item)

    # ------------------------------------------------------
    # 7. Save everything
    # ------------------------------------------------------

    db.commit()

    # ------------------------------------------------------
    # 8. Response
    # ------------------------------------------------------

    return CheckoutResponse(
        message="Checkout completed successfully",
        customer_id=customer_id,
        total_amount=total_amount,
        payment_method=checkout_data.Payment_Method,
        items_count=items_count
    )