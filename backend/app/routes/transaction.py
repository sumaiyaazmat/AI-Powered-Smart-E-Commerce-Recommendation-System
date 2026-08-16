from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.models import Transaction, Customer


router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"]
)


# ==========================================================
# GET CUSTOMER TRANSACTION HISTORY
# ==========================================================

@router.get("/{customer_id}")
def get_customer_transactions(
    customer_id: int,
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

    # Get transactions
    transactions = db.query(Transaction).filter(
        Transaction.Customer_ID == customer_id
    ).order_by(
        Transaction.Order_Date.desc()
    ).all()

    return transactions

# ==========================================================
# GET SINGLE TRANSACTION
# ==========================================================

@router.get("/detail/{transaction_id}")
def get_transaction(
    transaction_id: str,
    db: Session = Depends(get_db)
):

    transaction = db.query(Transaction).filter(
        Transaction.Transaction_ID == transaction_id
    ).first()

    if not transaction:
        raise HTTPException(
            status_code=404,
            detail="Transaction not found"
        )

    return transaction