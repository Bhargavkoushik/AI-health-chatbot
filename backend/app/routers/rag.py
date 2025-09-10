from fastapi import APIRouter, HTTPException
from typing import List

from app.models.schemas import (
    IngestionRequest, IngestionResponse,
    MedicalQueryRequest, MedicalQueryResponse,
    SystemStatusResponse
)
from app.services.rag.ingestion.ingestion_pipeline import IngestionPipeline
from app.services.rag.generation.medical_generator import MedicalGenerator
from app.services.rag.generation.gemini_generator import GeminiMedicalGenerator

router = APIRouter(prefix="/api/rag", tags=["RAG System"])

# Initialize components
pipeline = IngestionPipeline()
# generator = MedicalGenerator()
generator = GeminiMedicalGenerator() 

@router.post("/ingest", response_model=IngestionResponse)
async def ingest_documents(request: IngestionRequest):
    """Ingest medical documents into the knowledge base"""
    try:
        result = await pipeline.ingest_documents(
            file_paths=request.file_paths,
            chunking_strategy=request.chunking_strategy,
            recreate_collection=request.recreate_collection
        )
        
        return IngestionResponse(
            success=result["success"],
            processing_time_seconds=result["processing_time"],
            files_processed=result.get("files_processed", 0),
            chunks_created=result.get("chunks_created", 0),
            documents_stored=result.get("documents_stored", 0),
            error=result.get("error")
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query", response_model=MedicalQueryResponse)
async def query_medical_knowledge(request: MedicalQueryRequest):
    """Query the medical knowledge base"""
    try:
        result = await generator.generate_response(
            query=request.query,
            max_chunks=request.max_chunks
        )
        
        return MedicalQueryResponse(**result)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status", response_model=SystemStatusResponse)
async def get_system_status():
    """Get RAG system status"""
    try:
        # Check vector store connection
        vector_connected = pipeline.vector_store.health_check()
        
        # Check embedding model
        embedding_loaded = pipeline.embedding_manager.model is not None
        
        # Get document count
        collection_info = pipeline.vector_store.get_collection_info()
        doc_count = collection_info.get("points_count", 0)
        
        system_ready = vector_connected and embedding_loaded
        
        return SystemStatusResponse(
            status="ready" if system_ready else "not_ready",
            vector_store_connected=vector_connected,
            embedding_model_loaded=embedding_loaded,
            documents_count=doc_count,
            system_ready=system_ready
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/collect-and-ingest")
async def collect_and_ingest():
    """Collect medical data and ingest it"""
    try:
        # Run data collection
        import subprocess
        result = subprocess.run(["python", "collect_medical_data.py"], 
                              capture_output=True, text=True)
        
        if result.returncode != 0:
            raise HTTPException(status_code=500, detail="Data collection failed")
        
        # Ingest collected data
        from app.config import settings
        ingestion_result = await pipeline.ingest_documents(
            file_paths=settings.medical_sources,
            chunking_strategy="medical",
            recreate_collection=True
        )
        
        return {
            "success": True,
            "message": "Data collected and ingested successfully",
            "documents_processed": ingestion_result.get("documents_stored", 0)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
