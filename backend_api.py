from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import sys
import os

# Add src directory to path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from main_workflow import main_workflow, MainWorkflowState

app = FastAPI(title="NASA Exoplanet Detection API")

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    user_input: str
    attached_table: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    is_exoplanet_text: bool


@app.post("/chat", response_model=ChatResponse)
async def process_chat_message(request: ChatRequest):
    """
    Process a chat message through the main workflow
    """
    try:
        # Prepare state for main workflow
        state = MainWorkflowState(
            messages=[],
            user_input=request.user_input,
            attached_table=request.attached_table,
            response=""
        )

        # Run through main workflow
        result = main_workflow.invoke(state)

        if result.get("response"):
            return ChatResponse(
                response=result["response"],
                is_exoplanet_text=result["routing_decision"],
            )
        else:
            raise HTTPException(
                status_code=500,
                detail="Could not generate a response. Please try rephrasing your question or check your data format."
            )

    except Exception as e:
        error_msg = f"Error processing request: {str(e)}"
        if "vector" in str(e).lower():
            error_msg += "\n\nPlease ensure your vector data has exactly 122 values between 0.0 and 1.0."

        raise HTTPException(status_code=500, detail=error_msg)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "NASA Exoplanet Detection API is running"}


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "NASA Exoplanet Detection API",
        "endpoints": {
            "chat": "/chat - POST endpoint for processing messages",
            "health": "/health - GET health check",
            "docs": "/docs - API documentation"
        }
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
