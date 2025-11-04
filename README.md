# Gemini Chatbot

A modern AI chatbot built with **React.js**, **FastAPI**, and **Google Generative AI / Gemini API**. This chatbot allows users to create multiple chat sessions, send messages, receive AI-generated replies, and manage chats with rename and delete functionality.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- User authentication (login/signup)
- Create, rename, and delete chat sessions
- Send messages and receive AI-generated replies
- Chat history stored in MongoDB
- Responsive UI (desktop & mobile)
- Real-time message updates

---

## Tech Stack

- **Frontend:** React.js, Redux Toolkit, React-Bootstrap, MUI, Axios
- **Backend:** FastAPI, Python 3.10+, Uvicorn
- **Database:** MongoDB
- **AI/LLM:** Google Generative AI (Gemini API)
- **Authentication:** JWT token

---

## Gemini Chatbot Demo

<video src="https://raw.githubusercontent.com/usama-ansarii/Gemini-Chatbot-Fastapi-React/main/Chatbot%20demo.webm" controls width="600"></video>

[Click here if the video doesn’t load](https://raw.githubusercontent.com/usama-ansarii/Gemini-Chatbot-Fastapi-React/main/Chatbot%20demo.webm)



## Getting Started

### Backend Setup

1. Navigate to the backend folder:
```bash
cd backend


Create a virtual environment:

python -m venv venv
source venv/bin/activate


Install dependencies:

pip install -r requirements.txt


Start the FastAPI server:

uvicorn main:app --reload


The backend will run at http://127.0.0.1:8000.

Frontend Setup

Navigate to the frontend folder:

cd frontend


Install dependencies:

npm install


Start the React development server:

npm start


The frontend will run at http://localhost:3000.

Environment Variables

Create a .env file in the backend folder:

MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
GOOGLE_API_KEY=<your-google-generative-ai-key>
