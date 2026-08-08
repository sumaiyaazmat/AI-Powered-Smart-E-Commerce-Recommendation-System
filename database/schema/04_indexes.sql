USE ecommerce_ai;

-- =====================================================
-- AI-Powered Smart E-Commerce Recommendation System
-- Indexes
-- =====================================================

-- Products
CREATE INDEX idx_product_category
ON products(Category);

CREATE INDEX idx_product_brand
ON products(Brand);

CREATE INDEX idx_product_price
ON products(Price);

CREATE INDEX idx_product_rating
ON products(Rating);

-- Customers
CREATE INDEX idx_customer_city
ON customers(City);

CREATE INDEX idx_customer_membership
ON customers(Membership_Type);

CREATE INDEX idx_customer_age
ON customers(Age);

-- Transactions
CREATE INDEX idx_transaction_customer
ON transactions(Customer_ID);

CREATE INDEX idx_transaction_product
ON transactions(Product_ID);

CREATE INDEX idx_transaction_date
ON transactions(Order_Date);

CREATE INDEX idx_transaction_status
ON transactions(Order_Status);

CREATE INDEX idx_transaction_payment
ON transactions(Payment_Method);