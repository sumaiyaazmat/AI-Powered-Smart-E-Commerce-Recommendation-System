# ==========================================================
# AI-Powered E-Commerce Recommendation System
# File: clean_customers.py
# Purpose: Clean Customer Dataset
# ==========================================================

import pandas as pd
import numpy as np
import os

# ==========================================================
# 1. Load Dataset
# ==========================================================

print("=" * 60)
print("Loading Customer Dataset...")
print("=" * 60)

file_path = "../data/raw/E-commerce Customer Behavior - Sheet1.csv"

df = pd.read_csv(file_path)

print("\nDataset Loaded Successfully!")
print(f"Rows    : {df.shape[0]}")
print(f"Columns : {df.shape[1]}")

# ==========================================================
# 2. Basic Information
# ==========================================================

print("\n========== FIRST 5 RECORDS ==========")
print(df.head())

print("\n========== DATA TYPES ==========")
print(df.info())

print("\n========== STATISTICAL SUMMARY ==========")
print(df.describe(include="all"))

print("\n========== MISSING VALUES ==========")
print(df.isnull().sum())

print("\n========== DUPLICATES ==========")
print(df.duplicated().sum())

# ==========================================================
# 3. Remove Duplicates
# ==========================================================

df.drop_duplicates(inplace=True)

print("\nDuplicate Records Removed Successfully!")

# ==========================================================
# 4. Rename Columns
# ==========================================================

df.rename(columns={
    "Customer ID": "Customer_ID",
    "Membership Type": "Membership_Type",
    "Total Spend": "Total_Spend",
    "Items Purchased": "Items_Purchased",
    "Average Rating": "Average_Rating",
    "Discount Applied": "Discount_Applied",
    "Days Since Last Purchase": "Days_Since_Last_Purchase",
    "Satisfaction Level": "Satisfaction_Level"
}, inplace=True)

# ==========================================================
# 5. Handle Missing Values
# ==========================================================

df["Satisfaction_Level"] = df["Satisfaction_Level"].fillna("Unknown")

# ==========================================================
# 6. Standardize Text Columns
# ==========================================================

text_columns = [
    "Gender",
    "City",
    "Membership_Type",
    "Satisfaction_Level"
]

for col in text_columns:
    df[col] = (
        df[col]
        .astype(str)
        .str.strip()
        .str.title()
    )

# ==========================================================
# 7. Numeric Columns
# ==========================================================

numeric_columns = [
    "Age",
    "Total_Spend",
    "Items_Purchased",
    "Average_Rating",
    "Days_Since_Last_Purchase"
]

for col in numeric_columns:
    df[col] = pd.to_numeric(df[col], errors="coerce")

# ==========================================================
# 8. Membership Level
# ==========================================================

membership_map = {
    "Bronze":1,
    "Silver":2,
    "Gold":3
}

df["Membership_Level"] = df["Membership_Type"].map(membership_map)

# ==========================================================
# 9. Customer Segment
# ==========================================================

def segment(spend):

    if spend >= 1000:
        return "Premium"

    elif spend >= 500:
        return "Regular"

    else:
        return "Budget"

df["Customer_Segment"] = df["Total_Spend"].apply(segment)

# ==========================================================
# 10. Loyalty Score
# ==========================================================

df["Loyalty_Score"] = (
    (df["Items_Purchased"] * 2)
    +
    (df["Average_Rating"] * 10)
    -
    (df["Days_Since_Last_Purchase"] * 0.5)
)

df["Loyalty_Score"] = df["Loyalty_Score"].round(2)

# ==========================================================
# 11. Preferred Category
# ==========================================================

categories = [
    "Electronics",
    "Fashion",
    "Home",
    "Beauty",
    "Sports",
    "Books"
]

np.random.seed(42)

df["Preferred_Category"] = np.random.choice(
    categories,
    len(df)
)

# ==========================================================
# 12. Preferred Payment
# ==========================================================

payments = [
    "Credit Card",
    "Debit Card",
    "PayPal",
    "Cash On Delivery"
]

df["Preferred_Payment"] = np.random.choice(
    payments,
    len(df)
)

# ==========================================================
# 13. Registration Year
# ==========================================================

df["Registration_Year"] = np.random.randint(
    2020,
    2026,
    len(df)
)

# ==========================================================
# 14. Customer Status
# ==========================================================

df["Customer_Status"] = "Active"

# ==========================================================
# 15. Final Dataset Preview
# ==========================================================

print("\n========== FINAL DATASET ==========")

print(df.head())

print("\nShape :", df.shape)

print("\n========== CUSTOMER SEGMENTS ==========")

print(df["Customer_Segment"].value_counts())

print("\n========== MEMBERSHIP ==========")

print(df["Membership_Type"].value_counts())

# ==========================================================
# 16. Save Dataset
# ==========================================================

output_folder = "../data/processed"

os.makedirs(output_folder, exist_ok=True)

output_path = os.path.join(
    output_folder,
    "customers_cleaned.xlsx"
)

df.to_excel(output_path,index=False)

print("\nDataset Saved Successfully!")

print(output_path)

print("\nCleaning Completed Successfully!")

print("="*60)