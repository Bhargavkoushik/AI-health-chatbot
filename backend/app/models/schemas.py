from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

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

class MedicalQueryRequest(BaseModel):
    query: str = Field(..., description="Medical query", min_length=1)
    max_chunks: Optional[int] = Field(3, description="Max chunks to retrieve")

class MedicalQueryResponse(BaseModel):
    success: bool
    query: str
    response: str
    sources: List[str]
    processing_time: float
    error: Optional[str] = None

class SystemStatusResponse(BaseModel):
    status: str
    vector_store_connected: bool
    embedding_model_loaded: bool
    documents_count: int
    system_ready: bool
