# ==========================================================
# AI-Powered E-Commerce Recommendation System
# File: clean_products.py
# Purpose: Clean Amazon Products Dataset
# ==========================================================

import pandas as pd
import numpy as np
import re
import os

# ==========================================================
# 1. Load Dataset
# ==========================================================

print("=" * 60)
print("Loading Amazon Products Dataset...")
print("=" * 60)

file_path = "../data/raw/Amazon_products.pkl"

df = pd.read_pickle(file_path)

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

print("\n========== MISSING VALUES ==========")
print(df.isnull().sum())

print("\n========== DUPLICATES ==========")
print(df.duplicated().sum())

# ==========================================================
# 3. Remove Duplicate Products
# ==========================================================

df.drop_duplicates(subset="asin", inplace=True)

print("\nDuplicates Removed")

# ==========================================================
# 4. Rename Columns
# ==========================================================

df.rename(columns={
    "asin": "Product_ID",
    "title": "Product_Name",
    "price": "Price",
    "list_price": "List_Price",
    "rating": "Rating",
    "reviews": "Reviews",
    "brand": "Brand",
    "is_bestseller": "BestSeller",
    "is_prime": "Prime",
    "is_amazon_choice": "AmazonChoice"
}, inplace=True)

# ==========================================================
# 5. Clean Prices
# ==========================================================

def clean_price(price):

    if pd.isna(price):
        return np.nan

    price = str(price)

    price = re.sub(r"[^\d.]", "", price)

    try:
        return float(price)
    except:
        return np.nan


df["Price"] = df["Price"].apply(clean_price)
df["List_Price"] = df["List_Price"].apply(clean_price)

# Fill Missing Prices

df["Price"] = df["Price"].fillna(df["Price"].median())

df["List_Price"] = df["List_Price"].fillna(df["Price"])

# ==========================================================
# 6. Rating
# ==========================================================

df["Rating"] = pd.to_numeric(df["Rating"], errors="coerce")

df["Rating"] = df["Rating"].fillna(df["Rating"].median())

# ==========================================================
# 7. Reviews
# ==========================================================

df["Reviews"] = (
    df["Reviews"]
    .astype(str)
    .str.replace(",", "")
)

df["Reviews"] = pd.to_numeric(
    df["Reviews"],
    errors="coerce"
)

df["Reviews"] = df["Reviews"].fillna(0)

# ==========================================================
# 8. Brand Cleaning
# ==========================================================

df["Brand"] = df["Brand"].fillna("Unknown")

# ==========================================================
# 9. Product Category
# ==========================================================

def assign_category(title):

    title = str(title).lower()

    if any(x in title for x in [
        "laptop","mouse","keyboard","monitor","usb",
        "ssd","hard drive","computer","headphone",
        "earbuds","speaker","camera","phone","iphone",
        "android","charger"
    ]):
        return "Electronics"

    elif any(x in title for x in [
        "shirt","dress","jeans","shoe","jacket",
        "hoodie","pant","sock","cap","fashion"
    ]):
        return "Fashion"

    elif any(x in title for x in [
        "cream","face","makeup","lipstick",
        "serum","shampoo","beauty","skin"
    ]):
        return "Beauty"

    elif any(x in title for x in [
        "chair","table","sofa","kitchen",
        "lamp","storage","blanket","home"
    ]):
        return "Home"

    elif any(x in title for x in [
        "football","cricket","gym","fitness",
        "yoga","sport","dumbbell"
    ]):
        return "Sports"

    elif any(x in title for x in [
        "book","novel","journal","notebook"
    ]):
        return "Books"

    else:
        return "Other"


df["Category"] = df["Product_Name"].apply(assign_category)

# ==========================================================
# 10. Stock Quantity
# ==========================================================

np.random.seed(42)

df["Stock"] = np.random.randint(
    20,
    300,
    size=len(df)
)

# ==========================================================
# 11. Product Status
# ==========================================================

df["Status"] = "Available"

# ==========================================================
# 12. Image URL
# ==========================================================

df["Image_URL"] = "Coming Soon"

# ==========================================================
# 13. Product Description
# ==========================================================

df["Description"] = (
    "Premium quality "
    + df["Product_Name"].astype(str)
)

# ==========================================================
# 14. Reorder Columns
# ==========================================================

columns = [

"Product_ID",
"Product_Name",
"Category",
"Brand",
"Price",
"List_Price",
"Rating",
"Reviews",
"BestSeller",
"Prime",
"AmazonChoice",
"Stock",
"Status",
"Image_URL",
"Description"

]

df = df[columns]

# ==========================================================
# 15. Summary
# ==========================================================

print("\n========== FINAL DATASET ==========")

print(df.head())

print("\nShape :", df.shape)

print("\nCategory Distribution")

print(df["Category"].value_counts())

# ==========================================================
# 16. Save Clean Dataset
# ==========================================================

output_folder = "../data/processed"

os.makedirs(output_folder, exist_ok=True)

output_path = os.path.join(
    output_folder,
    "products_cleaned.xlsx"
)

df.to_excel(
    output_path,
    index=False
)

print("\nDataset Saved Successfully!")
print(output_path)

print("\nCleaning Completed Successfully!")