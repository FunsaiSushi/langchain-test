from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from typing import Optional
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(title="Post Context Q&A API", 
              description="API for answering questions in the context of user-uploaded posts")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model for request data
class QueryRequest(BaseModel):
    question: str
    post_content: str
    model: Optional[str] = "llama-3.1-8b-instant"
    temperature: Optional[float] = 0.7
    max_tokens: Optional[int] = 1024

# Environment variables check middleware
@app.middleware("http")
async def check_api_key(request: Request, call_next):
    if not os.environ.get("GROQ_API_KEY"):
        logger.warning("GROQ_API_KEY not set!")
        return HTTPException(status_code=500, detail="API key not configured")
    return await call_next(request)

# Initialize the Groq LLM
def get_llm(model: str = "llama-3.1-8b-instant", temperature: float = 0.7, max_tokens: int = 1024):
    try:
        return ChatGroq(
            model=model,
            temperature=temperature,
            max_tokens=max_tokens,
            max_retries=2
        )
    except Exception as e:
        logger.error(f"Error initializing Groq LLM: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to initialize LLM: {str(e)}")

# Create the prompt template
def create_prompt():
    return ChatPromptTemplate.from_messages([
        ("system", "You are a helpful assistant that answers questions based on the provided content. "
                  "Stay factual and provide information only from the given context. "
                  "If the answer cannot be found in the context, politely mention that."),
        ("human", "Content for context:\n{post_content}\n\nQuestion: {question}")
    ])

@app.get("/")
async def root():
    return {"message": "Context-aware Q&A API is running"}

@app.post("/api/query")
async def query(request: QueryRequest):
    try:
        logger.info(f"Received question: {request.question}")
        
        # Initialize LLM with requested parameters
        llm = get_llm(
            model=request.model,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        )
        
        # Create prompt and chain
        prompt = create_prompt()
        chain = prompt | llm
        
        # Process the query
        result = chain.invoke({
            "question": request.question,
            "post_content": request.post_content
        })
        
        # Extract response data
        response_data = {
            "answer": result.content,
            "metadata": {}
        }
        
        # Add token usage if available
        if hasattr(result, 'response_metadata') and 'token_usage' in result.response_metadata:
            response_data["metadata"]["token_usage"] = result.response_metadata["token_usage"]
        
        logger.info(f"Generated response with {len(result.content)} characters")
        return response_data
        
    except Exception as e:
        logger.error(f"Error processing query: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/models")
async def list_models():
    """Endpoint to list available models from Groq"""
    return {
        "models": [
            "llama-3.1-8b-instant",
            "llama-3.1-70b-instant",
            "llama-3.1-405b-instant",
            "mixtral-8x7b-32768",
            "gemma-7b-it"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    # Check for API key
    if not os.environ.get("GROQ_API_KEY"):
        logger.warning("GROQ_API_KEY not set. Set it using os.environ['GROQ_API_KEY'] = 'your-key-here'")
    
    # Run the server
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)