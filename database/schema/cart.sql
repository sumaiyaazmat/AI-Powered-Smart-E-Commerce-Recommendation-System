USE ecommerce_ai;

CREATE TABLE cart_items (
    Cart_Item_ID INT PRIMARY KEY AUTO_INCREMENT,

    Customer_ID INT NOT NULL,

    Product_ID VARCHAR(20) NOT NULL,

    Quantity INT NOT NULL DEFAULT 1,

    Added_At DATETIME DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cart_customer
        FOREIGN KEY (Customer_ID)
        REFERENCES customers(Customer_ID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_cart_product
        FOREIGN KEY (Product_ID)
        REFERENCES products(Product_ID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT uq_customer_product
        UNIQUE (Customer_ID, Product_ID)
);
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