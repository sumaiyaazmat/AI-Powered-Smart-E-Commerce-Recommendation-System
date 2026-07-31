# ==========================================================
# AI-Powered Smart E-Commerce Recommendation System
# File: generate_transactions.py
# Part 1
# ==========================================================

import pandas as pd
import numpy as np
import random
import os
from datetime import datetime, timedelta

# ==========================================================
# Random Seed
# ==========================================================

random.seed(42)
np.random.seed(42)

# ==========================================================
# Load Cleaned Datasets
# ==========================================================

print("="*60)
print("Loading Cleaned Datasets...")
print("="*60)

products = pd.read_excel("../data/processed/products_cleaned.xlsx")
customers = pd.read_excel("../data/processed/customers_cleaned.xlsx")

print("\nProducts Shape :", products.shape)
print("Customers Shape:", customers.shape)

# ==========================================================
# Basic Information
# ==========================================================

print("\nProducts Preview")
print(products.head())

print("\nCustomers Preview")
print(customers.head())

# ==========================================================
# Generate Product Dictionary
# ==========================================================

print("\nPreparing Product Categories...")

category_products = {}

for category in products["Category"].unique():

    category_products[category] = products[
        products["Category"] == category
    ]

print("Categories Loaded Successfully!")

# ==========================================================
# Payment Methods
# ==========================================================

payment_methods = [

    "Credit Card",
    "Debit Card",
    "PayPal",
    "Cash On Delivery"

]

# ==========================================================
# Shipping Methods
# ==========================================================

shipping_methods = [

    "Standard",
    "Express",
    "Same Day"

]

# ==========================================================
# Order Status
# ==========================================================

order_status = [

    "Delivered",
    "Shipped",
    "Processing",
    "Cancelled"

]

# ==========================================================
# Coupon Codes
# ==========================================================

coupon_codes = [

    "NONE",
    "WELCOME10",
    "SAVE20",
    "FREESHIP",
    "NEWUSER"

]

# ==========================================================
# Generate Transaction IDs
# ==========================================================

transaction_counter = 100001

def transaction_id():

    global transaction_counter

    tid = f"TXN{transaction_counter}"

    transaction_counter += 1

    return tid

# ==========================================================
# Random Order Date
# ==========================================================

def random_order_date():

    start = datetime(2024,1,1)

    end = datetime(2025,7,30)

    difference = end-start

    days = random.randint(0,difference.days)

    return start + timedelta(days=days)

# ==========================================================
# Delivery Date
# ==========================================================

def delivery_date(order_date,status):

    if status=="Cancelled":

        return None

    return order_date + timedelta(
        days=random.randint(2,7)
    )

# ==========================================================
# Discount Logic
# ==========================================================

def discount(customer):

    if customer["Membership_Type"]=="Gold":

        return random.choice([10,15,20])

    elif customer["Membership_Type"]=="Silver":

        return random.choice([5,10])

    else:

        return random.choice([0,5])

# ==========================================================
# Shipping Cost
# ==========================================================

def shipping_cost(method):

    if method=="Standard":

        return 5

    elif method=="Express":

        return 15

    else:

        return 25

# ==========================================================
# Product Selection
# ==========================================================

def choose_product(customer):

    preferred = customer["Preferred_Category"]

    if preferred in category_products:

        subset = category_products[preferred]

        if len(subset)>0:

            return subset.sample(1).iloc[0]

    return products.sample(1).iloc[0]

# ==========================================================
# Customer Purchase Frequency
# ==========================================================

def purchase_frequency(customer):

    if customer["Customer_Segment"]=="Premium":

        return random.randint(20,35)

    elif customer["Customer_Segment"]=="Regular":

        return random.randint(12,20)

    else:

        return random.randint(5,12)

# ==========================================================
# Empty Transactions List
# ==========================================================

transactions=[]

print("\nInitialization Completed Successfully!")

print("="*60)
print("Ready to Generate Transactions...")
print("="*60)

# ==========================================================
# Generate Transactions
# ==========================================================

print("\nGenerating Transactions...")

for _, customer in customers.iterrows():

    num_orders = purchase_frequency(customer)

    for i in range(num_orders):

        product = choose_product(customer)

        qty = random.randint(1, 3)

        try:
            price = float(product["Price"])
        except:
            price = 50.0

        order_date = random_order_date()

        status = random.choices(

            order_status,

            weights=[75, 15, 8, 2]

        )[0]

        delivery = delivery_date(order_date, status)

        discount_percent = discount(customer)

        subtotal = qty * price

        discount_amount = subtotal * (discount_percent / 100)

        shipping = random.choice(shipping_methods)

        shipping_charge = shipping_cost(shipping)

        total = subtotal - discount_amount + shipping_charge

        payment = random.choice(payment_methods)

        coupon = random.choice(coupon_codes)

        transaction = {

            "Transaction_ID": transaction_id(),

            "Customer_ID": customer["Customer_ID"],

            "Product_ID": product["Product_ID"],

            "Product_Name": product["Product_Name"],

            "Category": product["Category"],

            "Brand": product["Brand"],

            "Quantity": qty,

            "Unit_Price": round(price,2),

            "Subtotal": round(subtotal,2),

            "Discount_Percent": discount_percent,

            "Discount_Amount": round(discount_amount,2),

            "Shipping_Method": shipping,

            "Shipping_Charge": shipping_charge,

            "Total_Amount": round(total,2),

            "Payment_Method": payment,

            "Coupon_Code": coupon,

            "Order_Status": status,

            "Order_Date": order_date.strftime("%Y-%m-%d"),

            "Delivery_Date":

                delivery.strftime("%Y-%m-%d")

                if delivery

                else None

        }

        transactions.append(transaction)

# ==========================================================
# Convert to DataFrame
# ==========================================================

transactions_df = pd.DataFrame(transactions)

print("\nTransactions Generated Successfully!")

print(transactions_df.head())

print("\nShape :", transactions_df.shape)

# ==========================================================
# Sort by Order Date
# ==========================================================

transactions_df = transactions_df.sort_values(

    by="Order_Date"

).reset_index(drop=True)

# ==========================================================
# Summary
# ==========================================================

print("\n===============================")

print("Transaction Summary")

print("===============================")

print("Total Transactions :", len(transactions_df))

print("Unique Customers   :", transactions_df["Customer_ID"].nunique())

print("Unique Products    :", transactions_df["Product_ID"].nunique())

print("Revenue            : $",

      round(transactions_df["Total_Amount"].sum(),2))

# ==========================================================
# Save Dataset
# ==========================================================

output_folder = "../data/final"

os.makedirs(output_folder, exist_ok=True)

output_path = os.path.join(

    output_folder,

    "transactions.xlsx"

)

transactions_df.to_excel(

    output_path,

    index=False

)

print("\nDataset Saved Successfully!")

print(output_path)

print("\nTransaction Generation Completed Successfully!")

print("="*60)