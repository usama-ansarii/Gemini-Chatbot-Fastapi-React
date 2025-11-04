from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth_routes import router as auth_router
from routes.chat_route import router as chat_router

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],    
    allow_headers=["*"]

)

app.include_router(auth_router)
app.include_router(chat_router)


@app.get("/")
async def root():
    return {"message": "🚀 Gemini Chatbot Backend is Running!"}

