import pandas as pd
from sqlalchemy import create_engine
from pathlib import Path
from urllib.parse import quote_plus
import os
from dotenv import load_dotenv

# .env file load karne ke liye
load_dotenv()

# ==========================================
# Project Base Directory
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent


username = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
database = os.getenv("DB_NAME")

# Encode password because it contains special characters
encoded_password = quote_plus(password)

engine = create_engine(
    f"mysql+pymysql://{username}:{encoded_password}@{host}/{database}"
)


# ==========================================
# Load Cleaned Files
# ==========================================

customers = pd.read_excel(
    BASE_DIR / "data" / "processed" / "customers_cleaned.xlsx"
)

products = pd.read_excel(
    BASE_DIR / "data" / "processed" / "products_cleaned.xlsx"
)





# ==========================================
# Import Data into MySQL
# ==========================================

#print("Importing customers...")
#
# customers.to_sql(
#     "customers",
#     engine,
#     if_exists="append",
#     index=False
# )
#
# print("Customers imported successfully.")
#
#
# print("Importing products...")
#
# products.to_sql(
#     "products",
#     engine,
#     if_exists="append",
#     index=False
# )

#print("Products imported successfully.")


transactions = pd.read_excel(
    BASE_DIR / "data" / "final" / "transactions.xlsx"
)

# Keep only columns that belong to the transactions table
transactions = transactions[
    [
        "Transaction_ID",
        "Customer_ID",
        "Product_ID",
        "Quantity",
        "Unit_Price",
        "Subtotal",
        "Discount_Percent",
        "Discount_Amount",
        "Shipping_Method",
        "Shipping_Charge",
        "Total_Amount",
        "Payment_Method",
        "Coupon_Code",
        "Order_Status",
        "Order_Date",
        "Delivery_Date"
    ]
]
print("Importing transactions...")

transactions.to_sql(
    "transactions",
    engine,
    if_exists="append",
    index=False
)

print("Transactions imported successfully.")


print("\n===================================")
print("Data Imported Successfully!")
print("===================================")