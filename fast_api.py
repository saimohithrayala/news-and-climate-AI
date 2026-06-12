from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from agent import agent

app = FastAPI(title="NEWS AI Engine Route Node")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    confirmed_tool: Optional[bool] = None

@app.post("/api/chat")
async def chat_endpoint(payload: ChatRequest):
    try:
        if payload.confirmed_tool is not None:
            if not payload.confirmed_tool:
                return {"response": "Operation canceled. Tool invocation blocked.", "requires_approval": False}
            
            result = agent.invoke({"messages": [{"role": "user", "content": payload.message}]})
            return {"response": result['messages'][-1].content, "requires_approval": False}

        msg_lower = payload.message.lower()
        has_weather = any(x in msg_lower for x in ["weather", "temperature", "temp", "climate"])
        has_news = any(x in msg_lower for x in ["news", "headline", "update", "article"])

        if has_weather or has_news:
            target_tool = "get_weather" if has_weather else "get_news"
            return {
                "response": f"NEWS AI requires confirmation to open datastream connector: '{target_tool}'",
                "requires_approval": True,
                "original_message": payload.message
            }

        result = agent.invoke({"messages": [{"role": "user", "content": payload.message}]})
        return {"response": result['messages'][-1].content, "requires_approval": False}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("fast_api:app", host="127.0.0.1", port=8000, reload=True)