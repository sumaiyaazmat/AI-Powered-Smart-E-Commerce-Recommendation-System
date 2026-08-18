from pydantic import BaseModel, Field
from datetime import date


# ==========================================================
# CREATE TRANSACTION / CHECKOUT
# ==========================================================

class TransactionCreate(BaseModel):

    Product_ID: str
    Quantity: int = Field(gt=0)

    Payment_Method: str

    Shipping_Method: str = "Standard"

    Shipping_Charge: float = Field(default=0, ge=0)

    Discount_Percent: float = Field(default=0, ge=0)

    Coupon_Code: str | None = None


# ==========================================================
# TRANSACTION RESPONSE
# ==========================================================

class TransactionResponse(BaseModel):

    Transaction_ID: str

    Customer_ID: int
    Product_ID: str

    Quantity: int

    Unit_Price: float | None = None
    Subtotal: float | None = None

    Discount_Percent: float | None = None
    Discount_Amount: float | None = None

    Shipping_Method: str | None = None
    Shipping_Charge: float | None = None

    Total_Amount: float | None = None

    Payment_Method: str | None = None
    Coupon_Code: str | None = None

    Order_Status: str | None = None

    Order_Date: date | None = None
    Delivery_Date: date | None = None

    class Config:
        from_attributes = True