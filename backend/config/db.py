from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

client = AsyncIOMotorClient(MONGO_URI)
db = client["Chatdb"]
users_collection = db["users"]
chat_collection = db["chats"]
message_collection = db["messages"]