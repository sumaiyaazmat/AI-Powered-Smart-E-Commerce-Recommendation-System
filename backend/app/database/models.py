from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    Boolean,
    Text,
    Date,
    ForeignKey,
    DateTime
)

from sqlalchemy.sql import func

from app.database.connection import Base


# ==========================================================
# PRODUCTS TABLE
# ==========================================================

class Product(Base):

    __tablename__ = "products"

    Product_ID = Column(String(20), primary_key=True)
    Product_Name = Column(String(255), nullable=False)
    Category = Column(String(100), nullable=False)
    Brand = Column(String(100))

    Price = Column(Numeric(10, 2), nullable=False)
    List_Price = Column(Numeric(10, 2))

    Rating = Column(Numeric(3, 2))
    Reviews = Column(Integer, default=0)

    BestSeller = Column(Boolean, default=False)
    Prime = Column(Boolean, default=False)
    AmazonChoice = Column(Boolean, default=False)

    Stock = Column(Integer, default=0)

    Status = Column(String(50))

    Image_URL = Column(Text)
    Description = Column(Text)


# ==========================================================
# CUSTOMERS TABLE
# ==========================================================

class Customer(Base):

    __tablename__ = "customers"

    Customer_ID = Column(Integer, primary_key=True)

    Gender = Column(String(10))
    Age = Column(Integer)
    City = Column(String(100))

    Membership_Type = Column(String(50))

    Total_Spend = Column(Numeric(12, 2))
    Items_Purchased = Column(Integer)

    Average_Rating = Column(Numeric(3, 2))
    Discount_Applied = Column(Numeric(5, 2))

    Days_Since_Last_Purchase = Column(Integer)

    Satisfaction_Level = Column(String(50))
    Membership_Level = Column(String(50))
    Customer_Segment = Column(String(50))

    Loyalty_Score = Column(Numeric(5, 2))

    Preferred_Category = Column(String(100))
    Preferred_Payment = Column(String(50))

    Registration_Year = Column(Integer)

    Customer_Status = Column(String(30))


# ==========================================================
# TRANSACTIONS TABLE
# ==========================================================

class Transaction(Base):

    __tablename__ = "transactions"

    Transaction_ID = Column(String(20), primary_key=True)

    Customer_ID = Column(
        Integer,
        ForeignKey("customers.Customer_ID"),
        nullable=False
    )

    Product_ID = Column(
        String(20),
        ForeignKey("products.Product_ID"),
        nullable=False
    )

    Quantity = Column(Integer, nullable=False)

    Unit_Price = Column(Numeric(10, 2))
    Subtotal = Column(Numeric(12, 2))

    Discount_Percent = Column(Numeric(5, 2))
    Discount_Amount = Column(Numeric(10, 2))

    Shipping_Method = Column(String(50))
    Shipping_Charge = Column(Numeric(8, 2))

    Total_Amount = Column(Numeric(12, 2))

    Payment_Method = Column(String(50))
    Coupon_Code = Column(String(50))

    Order_Status = Column(String(30))

    Order_Date = Column(Date)
    Delivery_Date = Column(Date)



# ==========================================================
# CUSTOMER AUTHENTICATION TABLE
# ==========================================================

class CustomerAuth(Base):

    __tablename__ = "customer_auth"

    Auth_ID = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    Customer_ID = Column(
        Integer,
        ForeignKey("customers.Customer_ID"),
        nullable=False
    )

    Full_Name = Column(
        String(255),
        nullable=False
    )

    Email = Column(
        String(255),
        unique=True,
        nullable=False
    )

    Password_Hash = Column(
        String(255),
        nullable=False
    )

    Created_At = Column(
        DateTime,
        server_default=func.now()
    )

# ==========================================================
# CART ITEMS TABLE
# ==========================================================

class CartItem(Base):

    __tablename__ = "cart_items"

    Cart_Item_ID = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    Customer_ID = Column(
        Integer,
        ForeignKey("customers.Customer_ID"),
        nullable=False
    )

    Product_ID = Column(
        String(20),
        ForeignKey("products.Product_ID"),
        nullable=False
    )

    Quantity = Column(
        Integer,
        nullable=False
    )

# ==========================================================
# CONTACT MESSAGES TABLE
# ==========================================================

class ContactMessage(Base):

    __tablename__ = "contact_messages"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    name = Column(
        String(255),
        nullable=False
    )

    email = Column(
        String(255),
        nullable=False
    )

    subject = Column(
        String(255),
        nullable=False
    )

    message = Column(
        Text,
        nullable=False
    )

    status = Column(
        String(30),
        default="New"
    )

    created_at = Column(
        DateTime,
        server_default=func.now()
    )