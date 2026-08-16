-- ==========================================================
-- AI-Powered Smart E-Commerce Recommendation System
-- Customer Authentication
-- ==========================================================

CREATE TABLE customer_auth (

    Auth_ID INT AUTO_INCREMENT PRIMARY KEY,

    Customer_ID INT NOT NULL,

    Full_Name VARCHAR(255) NOT NULL,

    Email VARCHAR(255) NOT NULL UNIQUE,

    Password_Hash VARCHAR(255) NOT NULL,

    Created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_customer_auth_customer
        FOREIGN KEY (Customer_ID)
        REFERENCES customers(Customer_ID)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);