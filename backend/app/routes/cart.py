from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db

from app.database.models import (
    CartItem,
    Product,
    Customer
)

from app.database.schema.cart import (
    CartItemCreate,
    CartItemUpdate,
    CartItemResponse
)

router = APIRouter(
    prefix="/cart",
    tags=["Cart"]
)


# ==========================================================
# HELPER: BUILD CART RESPONSE
# ==========================================================

def build_cart_response(cart_item, product):
    return {
        "Cart_Item_ID": cart_item.Cart_Item_ID,
        "Customer_ID": cart_item.Customer_ID,
        "Product_ID": cart_item.Product_ID,
        "Quantity": cart_item.Quantity,

        "Product_Name": product.Product_Name,
        "Image_URL": product.Image_URL,
        "Price": product.Price,
    }


# ==========================================================
# ADD TO CART
# ==========================================================

@router.post(
    "/",
    response_model=CartItemResponse
)
def add_to_cart(
    customer_id: int,
    cart_data: CartItemCreate,
    db: Session = Depends(get_db)
):

    # ------------------------------------------------------
    # Check customer
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
    # Check product
    # ------------------------------------------------------

    product = db.query(Product).filter(
        Product.Product_ID == cart_data.Product_ID
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # ------------------------------------------------------
    # Check stock
    # ------------------------------------------------------

    if product.Stock < cart_data.Quantity:
        raise HTTPException(
            status_code=400,
            detail="Not enough stock available"
        )

    # ------------------------------------------------------
    # Check if product already exists in cart
    # ------------------------------------------------------

    existing_item = db.query(CartItem).filter(
        CartItem.Customer_ID == customer_id,
        CartItem.Product_ID == cart_data.Product_ID
    ).first()

    if existing_item:

        new_quantity = (
            existing_item.Quantity +
            cart_data.Quantity
        )

        if product.Stock < new_quantity:
            raise HTTPException(
                status_code=400,
                detail="Not enough stock available"
            )

        existing_item.Quantity = new_quantity

        db.commit()
        db.refresh(existing_item)

        return build_cart_response(
            existing_item,
            product
        )

    # ------------------------------------------------------
    # Create new cart item
    # ------------------------------------------------------

    new_item = CartItem(
        Customer_ID=customer_id,
        Product_ID=cart_data.Product_ID,
        Quantity=cart_data.Quantity
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return build_cart_response(
        new_item,
        product
    )


# ==========================================================
# VIEW CART
# ==========================================================

@router.get(
    "/{customer_id}",
    response_model=list[CartItemResponse]
)
def get_cart(
    customer_id: int,
    db: Session = Depends(get_db)
):

    # ------------------------------------------------------
    # Check customer
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
    # Get cart items
    # ------------------------------------------------------

    cart_items = db.query(CartItem).filter(
        CartItem.Customer_ID == customer_id
    ).all()

    result = []

    # ------------------------------------------------------
    # Get product information for each cart item
    # ------------------------------------------------------

    for cart_item in cart_items:

        product = db.query(Product).filter(
            Product.Product_ID == cart_item.Product_ID
        ).first()

        if not product:
            continue

        result.append(
            build_cart_response(
                cart_item,
                product
            )
        )

    return result


# ==========================================================
# UPDATE CART QUANTITY
# ==========================================================

@router.put(
    "/{cart_item_id}",
    response_model=CartItemResponse
)
def update_cart_quantity(
    cart_item_id: int,
    customer_id: int,
    cart_data: CartItemUpdate,
    db: Session = Depends(get_db)
):

    cart_item = db.query(CartItem).filter(
        CartItem.Cart_Item_ID == cart_item_id,
        CartItem.Customer_ID == customer_id
    ).first()

    if not cart_item:
        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )

    # ------------------------------------------------------
    # Get product
    # ------------------------------------------------------

    product = db.query(Product).filter(
        Product.Product_ID == cart_item.Product_ID
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # ------------------------------------------------------
    # Check stock
    # ------------------------------------------------------

    if product.Stock < cart_data.Quantity:
        raise HTTPException(
            status_code=400,
            detail="Not enough stock available"
        )

    # ------------------------------------------------------
    # Update quantity
    # ------------------------------------------------------

    cart_item.Quantity = cart_data.Quantity

    db.commit()
    db.refresh(cart_item)

    return build_cart_response(
        cart_item,
        product
    )


# ==========================================================
# REMOVE FROM CART
# ==========================================================

@router.delete("/{cart_item_id}")
def remove_from_cart(
    cart_item_id: int,
    customer_id: int,
    db: Session = Depends(get_db)
):

    cart_item = db.query(CartItem).filter(
        CartItem.Cart_Item_ID == cart_item_id,
        CartItem.Customer_ID == customer_id
    ).first()

    if not cart_item:
        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )

    db.delete(cart_item)
    db.commit()

    return {
        "message": "Product removed from cart successfully"
    }