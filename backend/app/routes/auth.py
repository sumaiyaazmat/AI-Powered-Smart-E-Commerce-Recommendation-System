from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from pwdlib import PasswordHash

from app.database.connection import get_db
from app.database.models import Customer, CustomerAuth
from app.database.schema.auth import SignupRequest, LoginRequest


# ==========================================================
# ROUTER
# ==========================================================

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ==========================================================
# PASSWORD HASHING
# ==========================================================

password_hash = PasswordHash.recommended()


# ==========================================================
# SIGNUP
# ==========================================================

@router.post("/signup")
def signup(
    data: SignupRequest,
    db: Session = Depends(get_db)
):

    # Check if email already exists
    existing_user = (
        db.query(CustomerAuth)
        .filter(CustomerAuth.Email == data.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Get highest existing Customer_ID
    max_customer_id = (
        db.query(func.max(Customer.Customer_ID))
        .scalar()
    )

    # Generate next Customer_ID
    if max_customer_id is None:
        new_customer_id = 1
    else:
        new_customer_id = max_customer_id + 1

    # ======================================================
    # CREATE CUSTOMER
    # ======================================================

    new_customer = Customer(
        Customer_ID=new_customer_id,
        Registration_Year=datetime.now().year,
        Customer_Status="Active",
        Total_Spend=0,
        Items_Purchased=0
    )

    db.add(new_customer)

    # ======================================================
    # HASH PASSWORD
    # ======================================================

    hashed_password = password_hash.hash(
        data.password
    )

    # ======================================================
    # CREATE AUTH RECORD
    # ======================================================

    new_auth = CustomerAuth(
        Customer_ID=new_customer_id,
        Full_Name=data.full_name,
        Email=data.email,
        Password_Hash=hashed_password
    )

    db.add(new_auth)

    # Save both records
    db.commit()

    return {
        "message": "Account created successfully",
        "Customer_ID": new_customer_id,
        "full_name": data.full_name,
        "email": data.email
    }


# ==========================================================
# LOGIN
# ==========================================================

@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    # Find user by email
    user = (
        db.query(CustomerAuth)
        .filter(CustomerAuth.Email == data.email)
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # Verify password
    password_valid = password_hash.verify(
        data.password,
        user.Password_Hash
    )

    if not password_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "message": "Login successful",
        "Customer_ID": user.Customer_ID,
        "full_name": user.Full_Name,
        "email": user.Email
    }