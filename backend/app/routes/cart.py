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
# ADD TO CART
# ==========================================================

@router.post("/", response_model=CartItemResponse)
def add_to_cart(
    customer_id: int,
    cart_data: CartItemCreate,
    db: Session = Depends(get_db)
):

    # Check customer
    customer = db.query(Customer).filter(
        Customer.Customer_ID == customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    # Check product
    product = db.query(Product).filter(
        Product.Product_ID == cart_data.Product_ID
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # Check stock
    if product.Stock < cart_data.Quantity:
        raise HTTPException(
            status_code=400,
            detail="Not enough stock available"
        )

    # Check if product already exists in customer's cart
    existing_item = db.query(CartItem).filter(
        CartItem.Customer_ID == customer_id,
        CartItem.Product_ID == cart_data.Product_ID
    ).first()

    if existing_item:

        new_quantity = existing_item.Quantity + cart_data.Quantity

        if product.Stock < new_quantity:
            raise HTTPException(
                status_code=400,
                detail="Not enough stock available"
            )

        existing_item.Quantity = new_quantity

        db.commit()
        db.refresh(existing_item)

        return existing_item

    # Create new cart item
    new_item = CartItem(
        Customer_ID=customer_id,
        Product_ID=cart_data.Product_ID,
        Quantity=cart_data.Quantity
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)

    return new_item


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

    customer = db.query(Customer).filter(
        Customer.Customer_ID == customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    cart_items = db.query(CartItem).filter(
        CartItem.Customer_ID == customer_id
    ).all()

    return cart_items


# ==========================================================
# UPDATE CART QUANTITY
# ==========================================================

@router.put("/{cart_item_id}")
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

    product = db.query(Product).filter(
        Product.Product_ID == cart_item.Product_ID
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    if product.Stock < cart_data.Quantity:
        raise HTTPException(
            status_code=400,
            detail="Not enough stock available"
        )

    cart_item.Quantity = cart_data.Quantity

    db.commit()
    db.refresh(cart_item)

    return cart_item


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