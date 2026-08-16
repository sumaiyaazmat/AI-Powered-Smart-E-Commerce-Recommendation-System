from pydantic import BaseModel, EmailStr


# ==========================================================
# SIGNUP
# ==========================================================

class SignupRequest(BaseModel):

    full_name: str
    email: EmailStr
    password: str


# ==========================================================
# LOGIN
# ==========================================================

class LoginRequest(BaseModel):

    email: EmailStr
    password: str