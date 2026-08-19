from io import BytesIO

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse

from sqlalchemy.orm import Session

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)

from app.database.connection import get_db
from app.database.models import (
    Customer,
    Transaction,
    Product
)


router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"]
)


# ==========================================================
# DOWNLOAD TRANSACTION SLIP
# ==========================================================

@router.get("/slip")
def download_transaction_slip(
    transaction_ids: str,
    db: Session = Depends(get_db)
):

    ids = [
        transaction_id.strip()
        for transaction_id in transaction_ids.split(",")
        if transaction_id.strip()
    ]

    if not ids:
        raise HTTPException(
            status_code=400,
            detail="No transaction IDs provided"
        )

    transactions = db.query(Transaction).filter(
        Transaction.Transaction_ID.in_(ids)
    ).all()

    if not transactions:
        raise HTTPException(
            status_code=404,
            detail="Transactions not found"
        )

    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    elements = []

    # ------------------------------------------------------
    # HEADER
    # ------------------------------------------------------

    elements.append(
        Paragraph(
            "<b>ARC STORE</b>",
            styles["Title"]
        )
    )

    elements.append(
        Paragraph(
            "TRANSACTION SLIP",
            styles["Heading2"]
        )
    )

    elements.append(
        Spacer(1, 15)
    )

    # ------------------------------------------------------
    # ORDER INFORMATION
    # ------------------------------------------------------

    first_transaction = transactions[0]

    elements.append(
        Paragraph(
            f"Customer ID: {first_transaction.Customer_ID}",
            styles["Normal"]
        )
    )

    elements.append(
        Paragraph(
            f"Order Date: {first_transaction.Order_Date}",
            styles["Normal"]
        )
    )

    elements.append(
        Paragraph(
            f"Payment Method: "
            f"{first_transaction.Payment_Method}",
            styles["Normal"]
        )
    )

    elements.append(
        Paragraph(
            f"Shipping Method: "
            f"{first_transaction.Shipping_Method}",
            styles["Normal"]
        )
    )

    elements.append(
        Spacer(1, 20)
    )

    # ------------------------------------------------------
    # PRODUCT TABLE
    # ------------------------------------------------------

    table_data = [
        [
            "Product",
            "Qty",
            "Unit Price",
            "Total"
        ]
    ]

    subtotal = 0.0
    shipping = 0.0

    for transaction in transactions:

        product = db.query(Product).filter(
            Product.Product_ID ==
            transaction.Product_ID
        ).first()

        product_name = (
            product.Product_Name
            if product
            else transaction.Product_ID
        )

        table_data.append([
            Paragraph(
                product_name,
                styles["Normal"]
            ),
            str(transaction.Quantity),
            f"${float(transaction.Unit_Price):.2f}",
            f"${float(transaction.Total_Amount):.2f}"
        ])

        subtotal += float(
            transaction.Subtotal or 0
        )

        shipping += float(
            transaction.Shipping_Charge or 0
        )

    table = Table(
        table_data,
        colWidths=[
            220,
            50,
            80,
            80
        ]
    )

    table.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.lightgrey
            ),
            (
                "TEXTCOLOR",
                (0, 0),
                (-1, 0),
                colors.black
            ),
            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.grey
            ),
            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Helvetica-Bold"
            ),
            (
                "ALIGN",
                (1, 1),
                (-1, -1),
                "RIGHT"
            ),
            (
                "VALIGN",
                (0, 0),
                (-1, -1),
                "MIDDLE"
            ),
            (
                "PADDING",
                (0, 0),
                (-1, -1),
                6
            ),
        ])
    )

    elements.append(table)

    elements.append(
        Spacer(1, 20)
    )

    # ------------------------------------------------------
    # TOTAL SUMMARY
    # ------------------------------------------------------

    grand_total = subtotal + shipping

    summary_data = [
        [
            "Subtotal",
            f"${subtotal:.2f}"
        ],
        [
            "Shipping",
            f"${shipping:.2f}"
        ],
        [
            "TOTAL",
            f"${grand_total:.2f}"
        ],
    ]

    summary_table = Table(
        summary_data,
        colWidths=[
            350,
            80
        ]
    )

    summary_table.setStyle(
        TableStyle([
            (
                "ALIGN",
                (1, 0),
                (1, -1),
                "RIGHT"
            ),
            (
                "FONTNAME",
                (0, -1),
                (-1, -1),
                "Helvetica-Bold"
            ),
            (
                "LINEABOVE",
                (0, -1),
                (-1, -1),
                1,
                colors.black
            ),
            (
                "PADDING",
                (0, 0),
                (-1, -1),
                5
            ),
        ])
    )

    elements.append(summary_table)

    elements.append(
        Spacer(1, 30)
    )

    # ------------------------------------------------------
    # FOOTER
    # ------------------------------------------------------

    elements.append(
        Paragraph(
            "Thank you for shopping with ARC STORE!",
            styles["Normal"]
        )
    )

    # ------------------------------------------------------
    # BUILD PDF
    # ------------------------------------------------------

    document.build(elements)

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
                "attachment; filename=Transaction_Slip.pdf"
        }
    )


# ==========================================================
# GET CUSTOMER TRANSACTION HISTORY
# ==========================================================

@router.get("/{customer_id}")
def get_transaction_history(
    customer_id: int,
    db: Session = Depends(get_db)
):

    # ------------------------------------------------------
    # 1. CHECK CUSTOMER
    # ------------------------------------------------------

    customer = db.query(Customer).filter(
        Customer.Customer_ID == customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    # ------------------------------------------------------
    # 2. GET CUSTOMER TRANSACTIONS
    # ------------------------------------------------------

    transactions = db.query(Transaction).filter(
        Transaction.Customer_ID == customer_id
    ).order_by(
        Transaction.Order_Date.desc()
    ).all()

    # ------------------------------------------------------
    # 3. BUILD RESPONSE
    # ------------------------------------------------------

    result = []

    for transaction in transactions:

        product = db.query(Product).filter(
            Product.Product_ID == transaction.Product_ID
        ).first()

        result.append({
            "Transaction_ID": transaction.Transaction_ID,
            "Customer_ID": transaction.Customer_ID,
            "Product_ID": transaction.Product_ID,

            "Product_Name": (
                product.Product_Name
                if product else None
            ),

            "Image_URL": (
                product.Image_URL
                if product else None
            ),

            "Quantity": transaction.Quantity,

            "Unit_Price": float(
                transaction.Unit_Price
            ) if transaction.Unit_Price is not None else 0.0,

            "Subtotal": float(
                transaction.Subtotal
            ) if transaction.Subtotal is not None else 0.0,

            "Shipping_Method": transaction.Shipping_Method,

            "Shipping_Charge": float(
                transaction.Shipping_Charge
            ) if transaction.Shipping_Charge is not None else 0.0,

            "Total_Amount": float(
                transaction.Total_Amount
            ) if transaction.Total_Amount is not None else 0.0,

            "Payment_Method": transaction.Payment_Method,

            "Order_Status": transaction.Order_Status,

            "Order_Date": (
                transaction.Order_Date.isoformat()
                if transaction.Order_Date
                else None
            ),

            "Delivery_Date": (
                transaction.Delivery_Date.isoformat()
                if transaction.Delivery_Date
                else None
            )
        })

    return result