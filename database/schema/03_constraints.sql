-- ==========================================================
-- AI-Powered Smart E-Commerce Recommendation System
-- Constraints
-- ==========================================================

USE ecommerce_ai;

-- ==========================================================
-- Foreign Key : Customer
-- ==========================================================

ALTER TABLE transactions
ADD CONSTRAINT fk_transactions_customer
FOREIGN KEY (Customer_ID)
REFERENCES customers(Customer_ID)
ON UPDATE CASCADE
ON DELETE RESTRICT;

-- ==========================================================
-- Foreign Key : Product
-- ==========================================================

ALTER TABLE transactions
ADD CONSTRAINT fk_transactions_product
FOREIGN KEY (Product_ID)
REFERENCES products(Product_ID)
ON UPDATE CASCADE
ON DELETE RESTRICT;