from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# Existing schemas (keep unchanged)
class IngestionRequest(BaseModel):
    file_paths: List[str] = Field(..., description="List of file paths to ingest")
    chunking_strategy: str = Field("medical", description="Chunking strategy")
    recreate_collection: bool = Field(False, description="Recreate vector collection")

class IngestionResponse(BaseModel):
    success: bool
    processing_time_seconds: float
    files_processed: int
    chunks_created: int
    documents_stored: int
    error: Optional[str] = None

class SystemStatusResponse(BaseModel):
    status: str
    vector_store_connected: bool
    embedding_model_loaded: bool
    documents_count: int
    system_ready: bool

# UPDATED: Enhanced MedicalQueryRequest with session support
class MedicalQueryRequest(BaseModel):
    query: str = Field(..., description="Medical query", min_length=1)
    max_chunks: Optional[int] = Field(3, description="Max chunks to retrieve")
    session_id: Optional[str] = Field(None, description="Conversation session ID")

# UPDATED: Enhanced MedicalQueryResponse with session info
class MedicalQueryResponse(BaseModel):
    success: bool
    query: str
    response: str
    session_id: str
    conversation_context_used: bool = Field(False, description="Whether conversation context was used")
    sources: List[str] = []
    urgency_level: str = "routine"
    chunks_used: int = 0
    generation_time: float = 0.0
    model_used: str = "gemini-1.5-flash"
    safety_validated: bool = True
    emergency_detected: bool = False
    timestamp: str
    processing_time: float = 0.0  # For backward compatibility
    error: Optional[str] = None

# NEW: Session management schemas
class SessionCreateResponse(BaseModel):
    session_id: str
    message: str = "New conversation session created"

class SessionHistoryResponse(BaseModel):
    session_id: str
    messages: List[Dict[str, Any]]
    message_count: int
    created_at: str
    updated_at: str

class SessionStatusResponse(BaseModel):
    session_id: str
    exists: bool
    message_count: int = 0
    last_activity: Optional[str] = None

class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: str
    metadata: Optional[Dict[str, Any]] = None

# NEW: Unified chat request (works with or without session)
class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=1000, description="User's message")
    session_id: Optional[str] = Field(None, description="Optional session ID for conversation continuity")
    max_chunks: Optional[int] = Field(3, description="Max retrieval chunks")

class ChatResponse(BaseModel):
    success: bool
    query: str
    response: str
    session_id: str
    conversation_context_used: bool = False
    sources: List[str] = []
    generation_time: float
    timestamp: str
    error: Optional[str] = None
