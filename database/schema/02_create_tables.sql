-- ==========================================================
-- AI-Powered Smart E-Commerce Recommendation System
-- Create Tables
-- ==========================================================

USE ecommerce_ai;

-- ==========================================================
-- PRODUCTS TABLE
-- ==========================================================

CREATE TABLE products (

    Product_ID VARCHAR(20) PRIMARY KEY,

    Product_Name VARCHAR(255) NOT NULL,

    Category VARCHAR(100) NOT NULL,

    Brand VARCHAR(100),

    Price DECIMAL(10,2) NOT NULL,

    List_Price DECIMAL(10,2),

    Rating DECIMAL(3,2),

    Reviews INT DEFAULT 0,

    BestSeller BOOLEAN DEFAULT FALSE,

    Prime BOOLEAN DEFAULT FALSE,

    AmazonChoice BOOLEAN DEFAULT FALSE,

    Stock INT DEFAULT 0,

    Status VARCHAR(50),

    Image_URL TEXT,

    Description TEXT

);

-- ==========================================================
-- CUSTOMERS TABLE
-- ==========================================================

CREATE TABLE customers (

    Customer_ID INT PRIMARY KEY,

    Gender VARCHAR(10),

    Age INT,

    City VARCHAR(100),

    Membership_Type VARCHAR(50),

    Total_Spend DECIMAL(12,2),

    Items_Purchased INT,

    Average_Rating DECIMAL(3,2),

    Discount_Applied DECIMAL(5,2),

    Days_Since_Last_Purchase INT,

    Satisfaction_Level VARCHAR(50),

    Membership_Level VARCHAR(50),

    Customer_Segment VARCHAR(50),

    Loyalty_Score DECIMAL(5,2),

    Preferred_Category VARCHAR(100),

    Preferred_Payment VARCHAR(50),

    Registration_Year YEAR,

    Customer_Status VARCHAR(30)

);

-- ==========================================================
-- TRANSACTIONS TABLE
-- ==========================================================

CREATE TABLE transactions (

    Transaction_ID VARCHAR(20) PRIMARY KEY,

    Customer_ID INT NOT NULL,

    Product_ID VARCHAR(20) NOT NULL,

    Quantity INT NOT NULL,

    Unit_Price DECIMAL(10,2),

    Subtotal DECIMAL(12,2),

    Discount_Percent DECIMAL(5,2),

    Discount_Amount DECIMAL(10,2),

    Shipping_Method VARCHAR(50),

    Shipping_Charge DECIMAL(8,2),

    Total_Amount DECIMAL(12,2),

    Payment_Method VARCHAR(50),

    Coupon_Code VARCHAR(50),

    Order_Status VARCHAR(30),

    Order_Date DATE,

    Delivery_Date DATE

);