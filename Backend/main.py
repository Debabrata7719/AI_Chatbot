from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from .chat import get_bot_response
except ImportError:
    from chat import get_bot_response

app = FastAPI()

# allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


@app.post("/chat")
async def chat_api(data: ChatRequest):
    user_message = data.message.strip()
    if not user_message:
        raise HTTPException(status_code=400, detail="message cannot be empty")

    reply = get_bot_response(user_message)
    return {"response": reply}
