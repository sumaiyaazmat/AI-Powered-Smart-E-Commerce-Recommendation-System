from pydantic import BaseModel, Field


# ==========================================================
# ALLOWED PAYMENT METHODS
# ==========================================================

ALLOWED_PAYMENT_METHODS = [
    "Credit Card",
    "Debit Card",
    "PayPal",
    "Cash on Delivery"
]


# ==========================================================
# CHECKOUT REQUEST
# ==========================================================

class CheckoutRequest(BaseModel):

    Payment_Method: str = Field(
        ...,
        description="Payment method for the order"
    )

    Shipping_Method: str = Field(
        default="Standard",
        description="Shipping method for the order"
    )


# ==========================================================
# CHECKOUT RESPONSE
# ==========================================================

class CheckoutResponse(BaseModel):

    message: str
    customer_id: int
    total_amount: float
    payment_method: str
    items_count: int
    transaction_ids: list[str]