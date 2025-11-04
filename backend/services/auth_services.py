from fastapi import HTTPException
from config.db import users_collection
from utils.password_hash import get_password_hash, verify_hash_password
from utils.jwt_token import create_access_token, create_refresh_token

# Optional: Blacklisted tokens store
blacklisted_tokens = set()

async def signup_user(user):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pwd = get_password_hash(user.password)
    user_dict = user.model_dump()
    user_dict["password"] = hashed_pwd

    result = await users_collection.insert_one(user_dict)
    return {
        "message": "User Registered Successfully",
        "fullname": user.fullname,
        "email": user.email,
        "id": str(result.inserted_id),
    }

async def login_user(user):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_hash_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid Credentials")

    access_token = create_access_token({"email": db_user["email"], "user_id": str(db_user["_id"])})
    refresh_token = create_refresh_token({"email": db_user["email"], "user_id": str(db_user["_id"])})

    return {
        "message": "User login successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "email": db_user["email"],
        "user_id": str(db_user["_id"]),
    }

def logout_user(token: str):
    """
    Blacklist the access token or remove refresh token from DB if stored.
    """
    blacklisted_tokens.add(token)
    return {"message": "Logged out successfully"}
