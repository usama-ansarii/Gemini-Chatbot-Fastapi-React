from datetime import datetime
from pymongo.errors import PyMongoError
from config.db import chat_collection, message_collection
from utils.genai_client import generate_text
import asyncio
from bson import ObjectId


def _serialize(doc):
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc


# ✅ Create a chat if not exists (or return existing)
async def save_or_create_chat(user_id: str, first_message: str):
    try:
        chat_doc = {
            "user_id": user_id,
            "title": first_message[:40] or "Untitled Chat",
            "created_at": datetime.utcnow(),
        }
        res = await chat_collection.insert_one(chat_doc)
        chat_doc["_id"] = res.inserted_id
        return {"success": True, "data": _serialize(chat_doc)}
    except Exception as e:
        return {"success": False, "message": str(e)}


# ✅ Save a message to MongoDB
async def save_message(chat_id: str, user_id: str, sender: str, message: str):
    try:
        doc = {
            "chat_id": chat_id,
            "user_id": user_id,
            "sender": sender,
            "message": message,
            "timestamp": datetime.utcnow(),
        }
        res = await message_collection.insert_one(doc)
        doc["_id"] = res.inserted_id
        return {"success": True, "data": _serialize(doc)}
    except PyMongoError as e:
        return {"success": False, "message": str(e)}


# ✅ Get all chat sessions of a user
async def get_chat_history(user_id: str):
    try:
        cursor = chat_collection.find({"user_id": user_id}).sort("created_at", -1)
        docs = await cursor.to_list(length=100)
        return {"success": True, "data": [_serialize(d) for d in docs]}
    except Exception as e:
        return {"success": False, "message": str(e)}


# ✅ Get messages of one chat
async def get_chat_messages(chat_id: str, user_id: str):
    try:
        cursor = message_collection.find(
            {
                "chat_id": chat_id,
                "user_id": user_id, 
            }
        ).sort("timestamp", 1)
        docs = await cursor.to_list(length=100)
        return {"success": True, "data": [_serialize(d) for d in docs]}
    except Exception as e:
        return {"success": False, "message": str(e)}


# ✅ Generate AI reply and save bot message
async def generate_and_save_reply(chat_id: str, user_id: str, user_message: str):
    try:
        prompt = f"User: {user_message}\nAssistant:"
        llm_res = await asyncio.to_thread(generate_text, prompt)
        bot_text = (
            llm_res["text"]
            if llm_res["success"]
            else "Sorry, I couldn’t generate a response."
        )

        save_res = await save_message(chat_id, user_id, "bot", bot_text)
        return {
            "success": True,
            "data": {"bot": save_res["data"], "raw_llm": llm_res.get("raw")},
        }
    except Exception as e:
        return {"success": False, "message": str(e)}


async def delete_chat_service(chat_id: str, user_id: str):
    chat = await chat_collection.find_one({"_id": ObjectId(chat_id)})
    if not chat:
        return {"success": False, "message": "Chat not found"}
    if chat["user_id"] != user_id:
        return {"success": False, "message": "Unauthorized"}

    await chat_collection.delete_one({"_id": ObjectId(chat_id)})
    await message_collection.delete_many({"chat_id": chat_id})

    return {"success": True, "message": "Chat deleted successfully"}


async def rename_chat_service(chat_id: str, new_title: str, user_id: str):
    chat = await chat_collection.find_one({"_id": ObjectId(chat_id)})
    if not chat:
        return {"success": False, "message": "Chat not found"}
    if chat["user_id"] != user_id:
        return {"success": False, "message": "Unauthorized"}

    await chat_collection.update_one(
        {"_id": ObjectId(chat_id)}, {"$set": {"title": new_title}}
    )
    return {"success": True, "message": "Chat renamed successfully", "title": new_title}
