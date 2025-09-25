import time
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import JSONResponse
from loguru import logger

from app.config import settings
from app.routers import chat, prescription

# Feature flag to control RAG import/initialization (prevents connection errors if Qdrant isn't running)
ENABLE_RAG = os.getenv("ENABLE_RAG", "false").lower() in {"1", "true", "yes"}
RAG_AVAILABLE = False
if ENABLE_RAG:
    try:
        from app.routers import rag
        RAG_AVAILABLE = True
        logger.info("✅ RAG system loaded successfully")
    except Exception as e:
        RAG_AVAILABLE = False
        logger.warning(f"⚠️ RAG system not available: {e}")
else:
    logger.warning("⚠️ RAG disabled by configuration (set ENABLE_RAG=true to enable)")

app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="AI Health Assistant with RAG-powered medical knowledge"
)

# CORS middleware
if settings.debug:
    # In development, allow all origins to avoid intermittent port changes (5173/5174/5175)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5175",
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include routers
if RAG_AVAILABLE:
    app.include_router(rag.router)
    logger.info("✅ RAG router registered")
else:
    logger.warning("⚠️ RAG router skipped - Qdrant not available")
    
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(prescription.router, tags=["prescription"])
# app.include_router(health.router, prefix="/api", tags=["health"])

@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.app_name}",
        "version": settings.version,
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "version": settings.version
    }

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "error": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=settings.debug)
