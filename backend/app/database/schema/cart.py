from pydantic import BaseModel, Field


# ==========================================================
# ADD TO CART
# ==========================================================

class CartItemCreate(BaseModel):
    Product_ID: str
    Quantity: int = Field(gt=0)


# ==========================================================
# UPDATE CART QUANTITY
# ==========================================================

class CartItemUpdate(BaseModel):
    Quantity: int = Field(gt=0)


# ==========================================================
# CART ITEM RESPONSE
# ==========================================================

class CartItemResponse(BaseModel):
    Cart_Item_ID: int
    Customer_ID: int
    Product_ID: str
    Quantity: int

    # Product information
    Product_Name: str
    Price: float | None = None
    Image_URL: str | None = None

    class Config:
        from_attributes = True