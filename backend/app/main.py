from fastapi import FastAPI
from sqlalchemy import text

from app.database.connection import engine

from app.routes.product import router as products_router
from app.routes.auth import router as auth_router
from app.routes.cart import router as cart_router
from app.routes.checkout import router as checkout_router
from app.routes.transaction import router as transaction_router

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="AI-Powered Smart E-Commerce Recommendation System",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================================
# ROUTERS
# ==========================================================

app.include_router(products_router)
app.include_router(auth_router)
app.include_router(cart_router)
app.include_router(checkout_router)
app.include_router(transaction_router)


# ==========================================================
# ROOT
# ==========================================================

@app.get("/")
def root():
    return {
        "message": "E-Commerce Backend is running!"
    }


# ==========================================================
# TEST DATABASE
# ==========================================================

@app.get("/test-db")
def test_database():

    with engine.connect() as connection:
        result = connection.execute(
            text("SELECT DATABASE()")
        )

        database_name = result.scalar()

    return {
        "database": database_name,
        "status": "Connected successfully"
    }