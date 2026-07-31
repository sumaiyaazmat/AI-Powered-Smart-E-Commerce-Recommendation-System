# ==========================================================
# AI-Powered Smart E-Commerce Recommendation System
# File: build_master_dataset.py

# ==========================================================

import pandas as pd
import os

# ==========================================================
# Load Datasets
# ==========================================================

print("=" * 60)
print("Loading Processed Datasets...")
print("=" * 60)

products = pd.read_excel("../data/processed/products_cleaned.xlsx")
customers = pd.read_excel("../data/processed/customers_cleaned.xlsx")
transactions = pd.read_excel("../data/final/transactions.xlsx")

print("\nDatasets Loaded Successfully!")

# ==========================================================
# Dataset Shapes
# ==========================================================

print("\nProducts Shape     :", products.shape)
print("Customers Shape    :", customers.shape)
print("Transactions Shape :", transactions.shape)

# ==========================================================
# Preview Datasets
# ==========================================================

print("\n================ Products ================")
print(products.head())

print("\n================ Customers ================")
print(customers.head())

print("\n================ Transactions ================")
print(transactions.head())

# ==========================================================
# Missing Values
# ==========================================================

print("\n================ Missing Values ================")

print("\nProducts")
print(products.isnull().sum())

print("\nCustomers")
print(customers.isnull().sum())

print("\nTransactions")
print(transactions.isnull().sum())

# ==========================================================
# Duplicate Records
# ==========================================================

print("\n================ Duplicate Records ================")

print("Products     :", products.duplicated().sum())
print("Customers    :", customers.duplicated().sum())
print("Transactions :", transactions.duplicated().sum())

# ==========================================================
# Validate Primary Keys
# ==========================================================

print("\n================ Primary Key Validation ================")

print("Unique Product IDs  :", products["Product_ID"].nunique())
print("Unique Customer IDs :", customers["Customer_ID"].nunique())
print("Unique Transaction IDs :", transactions["Transaction_ID"].nunique())

# ==========================================================
# Check Foreign Keys
# ==========================================================

print("\n================ Foreign Key Validation ================")

missing_customers = transactions[
    ~transactions["Customer_ID"].isin(customers["Customer_ID"])
]

missing_products = transactions[
    ~transactions["Product_ID"].isin(products["Product_ID"])
]

print("Transactions with Invalid Customer IDs :", len(missing_customers))
print("Transactions with Invalid Product IDs  :", len(missing_products))

# ==========================================================
# Ready for Merge
# ==========================================================

print("\nAll Validation Completed Successfully!")
print("=" * 60)
print("Preparing to Build Master Dataset...")
print("=" * 60)

# ==========================================================
# Merge Transactions + Customers
# ==========================================================

master_df = transactions.merge(

    customers,

    on="Customer_ID",

    how="left"

)

print("\nTransactions + Customers Merged Successfully!")

print("Shape :", master_df.shape)

# ==========================================================
# Merge Products
# ==========================================================

master_df = master_df.merge(

    products,

    on="Product_ID",

    how="left",

    suffixes=("_Customer", "_Product")

)

print("\nProducts Merged Successfully!")

print("Master Dataset Shape :", master_df.shape)

# ==========================================================
# Preview Master Dataset
# ==========================================================

print("\n================ Master Dataset Preview ================")

print(master_df.head())

print("\nColumns")

print(master_df.columns.tolist())

print("\nPart 1 Completed Successfully!")
print("=" * 60)



# ==========================================================
# Revenue Analytics
# ==========================================================

print("\n" + "="*60)
print("MASTER DATASET ANALYTICS")
print("="*60)

print("\nTotal Revenue : $",
      round(master_df["Total_Amount"].sum(),2))

print("Average Order Value : $",
      round(master_df["Total_Amount"].mean(),2))

print("Total Customers :",
      master_df["Customer_ID"].nunique())

print("Total Products :",
      master_df["Product_ID"].nunique())

print("Total Transactions :",
      master_df["Transaction_ID"].nunique())

# ==========================================================
# Top Selling Categories
# ==========================================================

print("\n==============================")
print("Top Selling Categories")
print("==============================")

category_sales = master_df.groupby("Category_Product")[
    "Total_Amount"
].sum().sort_values(ascending=False)

print(category_sales)

# ==========================================================
# Top Brands
# ==========================================================

print("\n==============================")
print("Top Brands")
print("==============================")

brand_sales=master_df.groupby("Brand_Product")[
    "Total_Amount"
].sum().sort_values(ascending=False).head(10)

print(brand_sales)

# ==========================================================
# Top Customers
# ==========================================================

print("\n==============================")
print("Top Customers")
print("==============================")

top_customers = master_df.groupby("Customer_ID")[
    "Total_Amount"
].sum().sort_values(ascending=False).head(10)

print(top_customers)

# ==========================================================
# Membership Distribution
# ==========================================================

print("\n==============================")
print("Membership Distribution")
print("==============================")

print(master_df["Membership_Type"].value_counts())

# ==========================================================
# Customer Segments
# ==========================================================

print("\n==============================")
print("Customer Segments")
print("==============================")

print(master_df["Customer_Segment"].value_counts())

# ==========================================================
# Payment Methods
# ==========================================================

print("\n==============================")
print("Payment Methods")
print("==============================")

print(master_df["Payment_Method"].value_counts())

# ==========================================================
# Order Status
# ==========================================================

print("\n==============================")
print("Order Status")
print("==============================")

print(master_df["Order_Status"].value_counts())

# ==========================================================
# Shipping Methods
# ==========================================================

print("\n==============================")
print("Shipping Methods")
print("==============================")

print(master_df["Shipping_Method"].value_counts())

# ==========================================================
# Monthly Sales
# ==========================================================

master_df["Order_Date"] = pd.to_datetime(
    master_df["Order_Date"]
)

master_df["Month"] = master_df[
    "Order_Date"
].dt.to_period("M")

print("\n==============================")
print("Monthly Sales")
print("==============================")

monthly_sales = master_df.groupby("Month")[
    "Total_Amount"
].sum()

print(monthly_sales)

# ==========================================================
# Best Selling Products
# ==========================================================

print("\n==============================")
print("Top Selling Products")
print("==============================")

top_products = master_df.groupby("Product_Name_Product")[
    "Quantity"
].sum().sort_values(ascending=False).head(15)

print(top_products)

# ==========================================================
# Final Dataset Information
# ==========================================================

print("\n==============================")
print("Master Dataset Information")
print("==============================")

print(master_df.info())

print("\nFinal Shape :", master_df.shape)

# ==========================================================
# Save Master Dataset
# ==========================================================

output_folder = "../data/final"

os.makedirs(output_folder, exist_ok=True)

output_path = os.path.join(
    output_folder,
    "master_dataset.xlsx"
)

with pd.ExcelWriter(output_path) as writer:

    master_df.to_excel(
        writer,
        sheet_name="Master_Dataset",
        index=False
    )

    category_sales.to_excel(
        writer,
        sheet_name="Category_Sales"
    )

    brand_sales.to_excel(
        writer,
        sheet_name="Top_Brands"
    )

    top_customers.to_excel(
        writer,
        sheet_name="Top_Customers"
    )

    monthly_sales.to_excel(
        writer,
        sheet_name="Monthly_Sales"
    )

    top_products.to_excel(
        writer,
        sheet_name="Top_Products"
    )

print("\nDataset Saved Successfully!")
print(output_path)

print("\n" + "="*60)
print("MASTER DATASET CREATED SUCCESSFULLY!")
print("="*60)