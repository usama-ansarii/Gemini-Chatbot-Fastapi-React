from fastapi import APIRouter, Depends, HTTPException,Body
from models.chat_model import ChatMessage
from services.chat_services import (
    save_or_create_chat, save_message, generate_and_save_reply,
    get_chat_history, get_chat_messages,delete_chat_service, rename_chat_service
)
from utils.jwt_token import verify_access_token

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("/send")
async def send_message(payload: ChatMessage, token_data: dict = Depends(verify_access_token)):
    try:
        if token_data["user_id"] != payload.user_id:
            raise HTTPException(status_code=403, detail="Token user mismatch")

        # ✅ Step 1: Create chat if not provided
        if not payload.chat_id:
            chat_res = await save_or_create_chat(payload.user_id, payload.message)
            if not chat_res["success"]:
                raise HTTPException(status_code=500, detail=chat_res["message"])
            payload.chat_id = chat_res["data"]["id"]

        # ✅ Step 2: Save user message
        user_msg = await save_message(payload.chat_id, payload.user_id, "user", payload.message)
        if not user_msg["success"]:
            raise HTTPException(status_code=500, detail=user_msg["message"])

        # ✅ Step 3: Generate bot reply and save it
        bot_res = await generate_and_save_reply(payload.chat_id, payload.user_id, payload.message)
        if not bot_res["success"]:
            raise HTTPException(status_code=500, detail=bot_res["message"])

        return {
            "success": True,
            "chat_id": payload.chat_id,
            "user_message": user_msg["data"],
            "bot_message": bot_res["data"]["bot"]
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ✅ Fetch all chats (sidebar)
@router.get("/history/{user_id}")
async def get_history(user_id: str, token_data: dict = Depends(verify_access_token)):
    if token_data["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Token user mismatch")
    res = await get_chat_history(user_id)
    if not res["success"]:
        raise HTTPException(status_code=500, detail=res["message"])
    return {"success": True, "data": res["data"]}

# ✅ Fetch all messages of one chat
@router.get("/messages/{chat_id}")
async def get_chat_messages_api(chat_id: str, token_data: dict = Depends(verify_access_token)):
    res = await get_chat_messages(chat_id, user_id=token_data["user_id"])
    if not res["success"]:
        raise HTTPException(status_code=500, detail=res["message"])
    return {"success": True, "data": res["data"]}





@router.delete("/delete/{chat_id}")
async def delete_chat(chat_id: str, token_data: dict = Depends(verify_access_token)):
    try:
        res = await delete_chat_service(chat_id, token_data["user_id"])
        if not res["success"]:
            if res["message"] == "Unauthorized":
                raise HTTPException(status_code=403, detail=res["message"])
            else:
                raise HTTPException(status_code=404, detail=res["message"])
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/rename/{chat_id}")
async def rename_chat(chat_id: str, payload: dict = Body(...), token_data: dict = Depends(verify_access_token)):
    try:
        new_title = payload.get("title")
        if not new_title:
            raise HTTPException(status_code=400, detail="Title is required")

        res = await rename_chat_service(chat_id, new_title, token_data["user_id"])
        if not res["success"]:
            if res["message"] == "Unauthorized":
                raise HTTPException(status_code=403, detail=res["message"])
            else:
                raise HTTPException(status_code=404, detail=res["message"])
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
