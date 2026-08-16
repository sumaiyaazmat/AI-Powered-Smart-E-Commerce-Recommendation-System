
from pydantic import BaseModel
from typing import Optional


class ProductBase(BaseModel):
    Product_ID: str
    Product_Name: str
    Category: str
    Brand: Optional[str] = None
    Price: float
    List_Price: Optional[float] = None
    Rating: Optional[float] = None
    Reviews: Optional[int] = 0
    BestSeller: Optional[bool] = False
    Prime: Optional[bool] = False
    AmazonChoice: Optional[bool] = False
    Stock: Optional[int] = 0
    Status: Optional[str] = None
    Image_URL: Optional[str] = None
    Description: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    Product_Name: Optional[str] = None
    Category: Optional[str] = None
    Brand: Optional[str] = None
    Price: Optional[float] = None
    List_Price: Optional[float] = None
    Rating: Optional[float] = None
    Reviews: Optional[int] = None
    BestSeller: Optional[bool] = None
    Prime: Optional[bool] = None
    AmazonChoice: Optional[bool] = None
    Stock: Optional[int] = None
    Status: Optional[str] = None
    Image_URL: Optional[str] = None
    Description: Optional[str] = None


class ProductResponse(ProductBase):

    class Config:
        from_attributes = True

