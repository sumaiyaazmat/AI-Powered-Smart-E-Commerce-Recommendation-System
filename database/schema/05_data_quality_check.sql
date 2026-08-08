USE ecommerce_ai;

-- =========================================
-- DATA QUALITY CHECK
-- =========================================

-- 1. Check total records in each table
SELECT 'customers' AS table_name, COUNT(*) AS total_records
FROM customers
UNION ALL
SELECT 'products', COUNT(*)
FROM products
UNION ALL
SELECT 'transactions', COUNT(*)
FROM transactions;


-- 2. Check duplicate Customer IDs
SELECT
    Customer_ID,
    COUNT(*) AS duplicate_count
FROM customers
GROUP BY Customer_ID
HAVING COUNT(*) > 1;


-- 3. Check duplicate Product IDs
SELECT
    Product_ID,
    COUNT(*) AS duplicate_count
FROM products
GROUP BY Product_ID
HAVING COUNT(*) > 1;


-- 4. Check duplicate Transaction IDs
SELECT
    Transaction_ID,
    COUNT(*) AS duplicate_count
FROM transactions
GROUP BY Transaction_ID
HAVING COUNT(*) > 1;


-- 5. Check NULL values in customers
SELECT
    SUM(Customer_ID IS NULL) AS Customer_ID_NULL,
    SUM(Gender IS NULL) AS Gender_NULL,
    SUM(Age IS NULL) AS Age_NULL,
    SUM(City IS NULL) AS City_NULL,
    SUM(Membership_Type IS NULL) AS Membership_Type_NULL,
    SUM(Total_Spend IS NULL) AS Total_Spend_NULL,
    SUM(Items_Purchased IS NULL) AS Items_Purchased_NULL,
    SUM(Average_Rating IS NULL) AS Average_Rating_NULL,
    SUM(Discount_Applied IS NULL) AS Discount_Applied_NULL,
    SUM(Days_Since_Last_Purchase IS NULL) AS Days_Last_Purchase_NULL,
    SUM(Satisfaction_Level IS NULL) AS Satisfaction_NULL,
    SUM(Membership_Level IS NULL) AS Membership_Level_NULL,
    SUM(Customer_Segment IS NULL) AS Customer_Segment_NULL,
    SUM(Loyalty_Score IS NULL) AS Loyalty_Score_NULL,
    SUM(Preferred_Category IS NULL) AS Preferred_Category_NULL,
    SUM(Preferred_Payment IS NULL) AS Preferred_Payment_NULL,
    SUM(Registration_Year IS NULL) AS Registration_Year_NULL,
    SUM(Customer_Status IS NULL) AS Customer_Status_NULL
FROM customers;


-- 6. Check NULL values in products
SELECT
    SUM(Product_ID IS NULL) AS Product_ID_NULL,
    SUM(Product_Name IS NULL) AS Product_Name_NULL,
    SUM(Category IS NULL) AS Category_NULL,
    SUM(Brand IS NULL) AS Brand_NULL
FROM products;


-- 7. Check NULL values in transactions
SELECT
    SUM(Transaction_ID IS NULL) AS Transaction_ID_NULL,
    SUM(Customer_ID IS NULL) AS Customer_ID_NULL,
    SUM(Product_ID IS NULL) AS Product_ID_NULL,
    SUM(Quantity IS NULL) AS Quantity_NULL,
    SUM(Unit_Price IS NULL) AS Unit_Price_NULL,
    SUM(Subtotal IS NULL) AS Subtotal_NULL,
    SUM(Total_Amount IS NULL) AS Total_Amount_NULL,
    SUM(Order_Status IS NULL) AS Order_Status_NULL,
    SUM(Order_Date IS NULL) AS Order_Date_NULL
FROM transactions;


-- 8. Check invalid customer ages
SELECT *
FROM customers
WHERE Age < 10 OR Age > 100;


-- 9. Check invalid quantities
SELECT *
FROM transactions
WHERE Quantity <= 0;


-- 10. Check invalid prices
SELECT *
FROM transactions
WHERE Unit_Price < 0;


-- 11. Check invalid total amounts
SELECT *
FROM transactions
WHERE Total_Amount < 0;


-- 12. Check invalid discounts
SELECT *
FROM transactions
WHERE Discount_Percent < 0
   OR Discount_Percent > 100;


-- 13. Check invalid ratings
SELECT *
FROM customers
WHERE Average_Rating < 0
   OR Average_Rating > 5;


-- 14. Check transaction references to non-existing customers
SELECT DISTINCT t.Customer_ID
FROM transactions t
LEFT JOIN customers c
    ON t.Customer_ID = c.Customer_ID
WHERE c.Customer_ID IS NULL;


-- 15. Check transaction references to non-existing products
SELECT DISTINCT t.Product_ID
FROM transactions t
LEFT JOIN products p
    ON t.Product_ID = p.Product_ID
WHERE p.Product_ID IS NULL;