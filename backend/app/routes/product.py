from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import engine
from app.database.models import Product


from app.schemas.product import (
    ProductCreate,
    ProductResponse,
    ProductUpdate
)
router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


def get_db():
    with Session(engine) as session:
        yield session


# GET ALL PRODUCTS
@router.get("/", response_model=list[ProductResponse])
def get_products(db: Session = Depends(get_db)):

    products = db.query(Product).all()

    return products


# GET SINGLE PRODUCT
@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: str,
    db: Session = Depends(get_db)
):

    product = (
        db.query(Product)
        .filter(Product.Product_ID == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


# CREATE PRODUCT
@router.post("/", response_model=ProductResponse)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):

    existing_product = (
        db.query(Product)
        .filter(Product.Product_ID == product.Product_ID)
        .first()
    )

    if existing_product:
        raise HTTPException(
            status_code=400,
            detail="Product_ID already exists"
        )

    new_product = Product(
        Product_ID=product.Product_ID,
        Product_Name=product.Product_Name,
        Category=product.Category,
        Brand=product.Brand,
        Price=product.Price,
        List_Price=product.List_Price,
        Rating=product.Rating,
        Reviews=product.Reviews,
        BestSeller=product.BestSeller,
        Prime=product.Prime,
        AmazonChoice=product.AmazonChoice,
        Stock=product.Stock,
        Status=product.Status,
        Image_URL=product.Image_URL,
        Description=product.Description
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: str,
    product_data: ProductUpdate,
    db: Session = Depends(get_db)
):

    product = (
        db.query(Product)
        .filter(Product.Product_ID == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    update_data = product_data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)

    return product