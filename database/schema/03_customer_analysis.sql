USE ecommerce_ai;

-- =========================================
-- CUSTOMER ANALYSIS
-- =========================================

-- 1. Total number of customers
SELECT COUNT(*) AS total_customers
FROM customers;
-- 2. Active vs Inactive Customers
SELECT
    Customer_Status,
    COUNT(*) AS total_customers
FROM customers
GROUP BY Customer_Status;

-- 3. Customers by Membership Type
SELECT
    Membership_Type,
    COUNT(*) AS total_customers
FROM customers
GROUP BY Membership_Type
ORDER BY total_customers DESC;

-- 4. Average Customer Spending
SELECT
    ROUND(AVG(Total_Spend), 2) AS average_customer_spend
FROM customers;
-- 5. Top 10 Highest-Spending Customers
SELECT
    Customer_ID,
    City,
    Membership_Type,
    Total_Spend
FROM customers
ORDER BY Total_Spend DESC
LIMIT 10;
-- 6. Customers by City
SELECT
    City,
    COUNT(*) AS total_customers
FROM customers
GROUP BY City
ORDER BY total_customers DESC;
-- 7. Spending Analysis by Membership Type
SELECT
    Membership_Type,
    COUNT(*) AS total_customers,
    ROUND(AVG(Total_Spend), 2) AS average_spend,
    ROUND(SUM(Total_Spend), 2) AS total_spend
FROM customers
GROUP BY Membership_Type
ORDER BY total_spend DESC;
-- 8. Customer Segment Analysis
SELECT
    Customer_Segment,
    COUNT(*) AS total_customers,
    ROUND(AVG(Total_Spend), 2) AS average_spend,
    ROUND(SUM(Total_Spend), 2) AS total_spend
FROM customers
GROUP BY Customer_Segment
ORDER BY total_spend DESC;
-- 9. Customer Status by Membership Type
SELECT
    Membership_Type,
    Customer_Status,
    COUNT(*) AS total_customers
FROM customers
GROUP BY Membership_Type, Customer_Status
ORDER BY Membership_Type, Customer_Status;

-- 10. Customer Satisfaction Analysis
SELECT
    Satisfaction_Level,
    COUNT(*) AS total_customers,
    ROUND(AVG(Total_Spend), 2) AS average_spend
FROM customers
GROUP BY Satisfaction_Level
ORDER BY total_customers DESC;
-- 11. Preferred Product Category Analysis
SELECT
    Preferred_Category,
    COUNT(*) AS total_customers
FROM customers
GROUP BY Preferred_Category
ORDER BY total_customers DESC;
-- 12. Preferred Payment Method Analysis
SELECT
    Preferred_Payment,
    COUNT(*) AS total_customers
FROM customers
GROUP BY Preferred_Payment
ORDER BY total_customers DESC;
-- 13. Loyalty Score by Membership Type
SELECT
    Membership_Type,
    COUNT(*) AS total_customers,
    ROUND(AVG(Loyalty_Score), 2) AS average_loyalty_score
FROM customers
GROUP BY Membership_Type
ORDER BY average_loyalty_score DESC;