from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.models import ContactMessage
from app.database.schema.contact import ContactRequest


router = APIRouter(
    prefix="/contact",
    tags=["Contact"]
)


# ==========================================================
# SEND CONTACT MESSAGE
# ==========================================================

@router.post("")
def send_contact_message(
    data: ContactRequest,
    db: Session = Depends(get_db)
):

    new_message = ContactMessage(
        name=data.name,
        email=data.email,
        subject=data.subject,
        message=data.message
    )

    db.add(new_message)
    db.commit()
    db.refresh(new_message)

    return {
        "message": "Message sent successfully",
        "contact_id": new_message.id
    }