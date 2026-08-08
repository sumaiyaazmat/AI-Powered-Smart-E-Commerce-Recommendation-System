USE ecommerce_ai;

-- =========================================
-- TRANSACTION ANALYSIS
-- =========================================

-- 1. Total Number of Transactions
SELECT
    COUNT(*) AS total_transactions
FROM transactions;
-- 2. Transactions by Order Status
SELECT
    Order_Status,
    COUNT(*) AS total_transactions
FROM transactions
GROUP BY Order_Status
ORDER BY total_transactions DESC;
-- 3. Overall Revenue Analysis
SELECT
    ROUND(SUM(Total_Amount), 2) AS total_revenue,
    ROUND(AVG(Total_Amount), 2) AS average_order_value,
    ROUND(MIN(Total_Amount), 2) AS minimum_order_value,
    ROUND(MAX(Total_Amount), 2) AS maximum_order_value
FROM transactions;
-- 4. Revenue by Order Status
SELECT
    Order_Status,
    COUNT(*) AS total_orders,
    ROUND(SUM(Total_Amount), 2) AS total_revenue,
    ROUND(AVG(Total_Amount), 2) AS average_order_value
FROM transactions
GROUP BY Order_Status
ORDER BY total_revenue DESC;

-- 5. Revenue by Product Category
SELECT
    p.Category,
    COUNT(*) AS total_orders,
    ROUND(SUM(t.Total_Amount), 2) AS total_revenue,
    ROUND(AVG(t.Total_Amount), 2) AS average_order_value
FROM transactions t
JOIN products p
    ON t.Product_ID = p.Product_ID
GROUP BY p.Category
ORDER BY total_revenue DESC;
-- 6. Payment Method Analysis
SELECT
    Payment_Method,
    COUNT(*) AS total_orders,
    ROUND(SUM(Total_Amount), 2) AS total_revenue,
    ROUND(AVG(Total_Amount), 2) AS average_order_value
FROM transactions
GROUP BY Payment_Method
ORDER BY total_orders DESC;
-- 7. Shipping Method Analysis
SELECT
    Shipping_Method,
    COUNT(*) AS total_orders,
    ROUND(SUM(Shipping_Charge), 2) AS total_shipping_revenue,
    ROUND(AVG(Shipping_Charge), 2) AS average_shipping_charge
FROM transactions
GROUP BY Shipping_Method
ORDER BY total_orders DESC;
-- 8. Monthly Sales Trend
SELECT
    YEAR(Order_Date) AS order_year,
    MONTH(Order_Date) AS order_month,
    COUNT(*) AS total_orders,
    ROUND(SUM(Total_Amount), 2) AS total_revenue
FROM transactions
GROUP BY
    YEAR(Order_Date),
    MONTH(Order_Date)
ORDER BY
    order_year,
    order_month;
-- 9. Year-wise Sales Performance

SELECT
    YEAR(Order_Date) AS order_year,
    COUNT(*) AS total_orders,
    ROUND(SUM(Total_Amount), 2) AS total_revenue,
    ROUND(AVG(Total_Amount), 2) AS average_order_value
FROM transactions
GROUP BY YEAR(Order_Date)
ORDER BY order_year;
-- 10. Top Customers by Total Spending

SELECT
    Customer_ID,
    COUNT(*) AS total_orders,
    ROUND(SUM(Total_Amount), 2) AS total_spend,
    ROUND(AVG(Total_Amount), 2) AS average_order_value
FROM transactions
GROUP BY Customer_ID
ORDER BY total_spend DESC
LIMIT 10;
-- 11. Most Active Customers

SELECT
    Customer_ID,
    COUNT(*) AS total_orders,
    ROUND(SUM(Total_Amount), 2) AS total_spend
FROM transactions
GROUP BY Customer_ID
ORDER BY total_orders DESC
LIMIT 10;
-- 12. Best-Selling Products

SELECT
    Product_ID,
    COUNT(*) AS total_orders,
    SUM(Quantity) AS total_quantity_sold,
    ROUND(SUM(Total_Amount), 2) AS total_revenue
FROM transactions
GROUP BY Product_ID
ORDER BY total_quantity_sold DESC
LIMIT 10;
-- 13. Top Products by Revenue

SELECT
    Product_ID,
    COUNT(*) AS total_orders,
    SUM(Quantity) AS total_quantity_sold,
    ROUND(SUM(Total_Amount), 2) AS total_revenue
FROM transactions
GROUP BY Product_ID
ORDER BY total_revenue DESC
LIMIT 10;
-- 14. Top Products with Details

SELECT
    p.Product_ID,
    p.Product_Name,
    p.Category,
    p.Brand,
    COUNT(t.Transaction_ID) AS total_orders,
    SUM(t.Quantity) AS total_quantity_sold,
    ROUND(SUM(t.Total_Amount), 2) AS total_revenue
FROM transactions t
JOIN products p
    ON t.Product_ID = p.Product_ID
GROUP BY
    p.Product_ID,
    p.Product_Name,
    p.Category,
    p.Brand
ORDER BY total_revenue DESC
LIMIT 10;
-- 15. Category Performance

SELECT
    p.Category,
    COUNT(DISTINCT p.Product_ID) AS unique_products,
    SUM(t.Quantity) AS total_quantity_sold,
    ROUND(SUM(t.Total_Amount), 2) AS total_revenue,
    ROUND(AVG(t.Total_Amount), 2) AS average_order_value
FROM transactions t
JOIN products p
    ON t.Product_ID = p.Product_ID
GROUP BY p.Category
ORDER BY total_revenue DESC;
-- 16. Product Distribution by Category

SELECT
    Category,
    COUNT(*) AS total_products
FROM products
GROUP BY Category
ORDER BY total_products DESC;
-- 18. Customer's Most Purchased Category

SELECT
    Customer_ID,
    Category,
    total_quantity
FROM (
    SELECT
        t.Customer_ID,
        p.Category,
        SUM(t.Quantity) AS total_quantity,
        ROW_NUMBER() OVER (
            PARTITION BY t.Customer_ID
            ORDER BY SUM(t.Quantity) DESC
        ) AS category_rank
    FROM transactions t
    JOIN products p
        ON t.Product_ID = p.Product_ID
    GROUP BY
        t.Customer_ID,
        p.Category
) AS ranked_categories
WHERE category_rank = 1
ORDER BY Customer_ID;
-- 11. Total spending by each customer
SELECT
    Customer_ID,
    COUNT(Transaction_ID) AS total_orders,
    SUM(Total_Amount) AS total_spent,
    AVG(Total_Amount) AS average_order_value
FROM transactions
GROUP BY Customer_ID
ORDER BY total_spent DESC;
-- 12. Spending by Membership Type

SELECT
    c.Membership_Type,
    COUNT(DISTINCT c.Customer_ID) AS total_customers,
    COUNT(t.Transaction_ID) AS total_orders,
    ROUND(SUM(t.Total_Amount), 2) AS total_revenue,
    ROUND(AVG(t.Total_Amount), 2) AS average_order_value
FROM customers c
JOIN transactions t
    ON c.Customer_ID = t.Customer_ID
GROUP BY c.Membership_Type
ORDER BY total_revenue DESC;

-- 13. Category preference by membership type

SELECT
    c.Membership_Type,
    p.Category,
    COUNT(t.Transaction_ID) AS total_orders,
    SUM(t.Quantity) AS total_items,
    ROUND(SUM(t.Total_Amount), 2) AS total_spent
FROM customers c
JOIN transactions t
    ON c.Customer_ID = t.Customer_ID
JOIN products p
    ON t.Product_ID = p.Product_ID
GROUP BY
    c.Membership_Type,
    p.Category
ORDER BY
    c.Membership_Type,
    total_spent DESC;
-- 14. Customer Purchase Behavior

SELECT
    c.Customer_ID,
    c.Membership_Type,
    COUNT(t.Transaction_ID) AS total_orders,
    SUM(t.Quantity) AS total_items,
    ROUND(SUM(t.Total_Amount), 2) AS total_spent,
    ROUND(AVG(t.Total_Amount), 2) AS average_order_value
FROM customers c
JOIN transactions t
    ON c.Customer_ID = t.Customer_ID
GROUP BY
    c.Customer_ID,
    c.Membership_Type
ORDER BY total_spent DESC;