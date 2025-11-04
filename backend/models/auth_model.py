from pydantic import BaseModel,Field,EmailStr


class UserSignup(BaseModel):
    fullname: str = Field(...,min_length=3)
    email: EmailStr
    password: str = Field(...,min_length=8)


class UserLogin(BaseModel):
    email:EmailStr
    password: str