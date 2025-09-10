from pydantic_settings import BaseSettings
from typing import List, Optional
from pathlib import Path
import os

class Settings(BaseSettings):
    app_name: str = "Medibot AI Health Assistant"
    version: str = "2.0.0"
    debug: bool = True
    
    # Vector Database
    qdrant_url: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    qdrant_collection_name: str = "medical_knowledge"
    
    # Embeddings
    embedding_model_name: str = "sentence-transformers/all-MiniLM-L6-v2"
    embedding_dimension: int = 384
    embedding_batch_size: int = 32
    
    # API Keys
    google_api_key: Optional[str] = None   # 👈 Added this for Google Generative AI
    groq_api_key: Optional[str] = None     # Keep this in case you use Groq
    
    # Chunking
    chunk_size: int = 500
    chunk_overlap: int = 50
    
    # File handling
    max_file_size_mb: int = 10
    supported_file_types: List[str] = [".txt", ".json", ".csv", ".md", ".pdf", ".docx"]
    
    # Paths
    base_path: Path = Path(__file__).parent.parent
    medical_data_path: Path = base_path / "data" / "medical_knowledge"
    logs_path: Path = base_path.parent / "logs"
    cache_path: Path = base_path.parent / "cache"
    
    # Medical sources for ingestion
    medical_sources: List[str] = [
        str(base_path / "data" / "medical_knowledge" / "medlineplus_structured.json")
    ]
    
    class Config:
        env_file = ".env"
        extra = "ignore"  # Ignore extra environment variables

settings = Settings()

# Ensure directories exist
for path in [settings.medical_data_path, settings.logs_path, settings.cache_path]:
    path.mkdir(parents=True, exist_ok=True)
