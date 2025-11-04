from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Chat(BaseModel):
    id: Optional[str]
    user_id: str = Field(..., min_length=24, max_length=24)
    title: Optional[str] = "Untitled Chat"
    created_at: datetime = datetime.utcnow()

class ChatMessage(BaseModel):
    id: Optional[str] = None
    user_id: str
    chat_id: Optional[str] = None
    sender: str
    message: str

