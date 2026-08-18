from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.models import (
    Customer,
    Transaction,
    Product
)

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"]
)


# ==========================================================
# GET CUSTOMER TRANSACTION HISTORY
# ==========================================================

@router.get("/{customer_id}")
def get_transaction_history(
    customer_id: int,
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
    # 2. GET CUSTOMER TRANSACTIONS
    # ------------------------------------------------------

    transactions = db.query(Transaction).filter(
        Transaction.Customer_ID == customer_id
    ).order_by(
        Transaction.Order_Date.desc()
    ).all()

    # ------------------------------------------------------
    # 3. BUILD RESPONSE
    # ------------------------------------------------------

    result = []

    for transaction in transactions:

        product = db.query(Product).filter(
            Product.Product_ID == transaction.Product_ID
        ).first()

        result.append({
            "Transaction_ID": transaction.Transaction_ID,
            "Customer_ID": transaction.Customer_ID,
            "Product_ID": transaction.Product_ID,

            "Product_Name": (
                product.Product_Name
                if product else None
            ),

            "Image_URL": (
                product.Image_URL
                if product else None
            ),

            "Quantity": transaction.Quantity,

            "Unit_Price": float(
                transaction.Unit_Price
            ) if transaction.Unit_Price is not None else 0.0,

            "Subtotal": float(
                transaction.Subtotal
            ) if transaction.Subtotal is not None else 0.0,

            "Shipping_Method": transaction.Shipping_Method,

            "Shipping_Charge": float(
                transaction.Shipping_Charge
            ) if transaction.Shipping_Charge is not None else 0.0,

            "Total_Amount": float(
                transaction.Total_Amount
            ) if transaction.Total_Amount is not None else 0.0,

            "Payment_Method": transaction.Payment_Method,

            "Order_Status": transaction.Order_Status,

            "Order_Date": (
                transaction.Order_Date.isoformat()
                if transaction.Order_Date
                else None
            ),

            "Delivery_Date": (
                transaction.Delivery_Date.isoformat()
                if transaction.Delivery_Date
                else None
            )
        })

    return result