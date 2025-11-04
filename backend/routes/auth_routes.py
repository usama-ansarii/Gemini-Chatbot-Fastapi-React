from fastapi import APIRouter, Depends, HTTPException, Body
from models.auth_model import UserSignup, UserLogin
from services.auth_services import signup_user, login_user, logout_user
from utils.jwt_token import verify_access_token, verify_refresh_token, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

# ✅ Signup
@router.post("/signup")
async def signup(user: UserSignup):
    return await signup_user(user)

# ✅ Login
@router.post("/login")
async def login(user: UserLogin):
    return await login_user(user)

# ✅ Refresh token
@router.post("/refresh")
async def refresh_token(data: dict = Body(...)):
    refresh_token = data.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=400, detail="Refresh token required")
    payload = verify_refresh_token(refresh_token)
    new_access_token = create_access_token({"email": payload["email"], "user_id": payload["user_id"]})
    return {"access_token": new_access_token}

# ✅ Logout
@router.post("/logout")
async def logout(token_data: dict = Depends(verify_access_token)):
    access_token = token_data.get("token")
    if not access_token:
        raise HTTPException(status_code=400, detail="Token missing")
    return logout_user(access_token)
