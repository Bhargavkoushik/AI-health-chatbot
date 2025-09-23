from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional

from app.models.schemas import (
    IngestionRequest, IngestionResponse,
    MedicalQueryRequest, MedicalQueryResponse,
    SystemStatusResponse, ChatRequest, ChatResponse,
    SessionCreateResponse, SessionHistoryResponse, SessionStatusResponse
)
from app.services.rag.ingestion.ingestion_pipeline import IngestionPipeline
from app.services.rag.generation.medical_generator import MedicalGenerator
from app.services.rag.generation.gemini_generator import GeminiMedicalGenerator
from app.services.rag.generation.contextual_gemini_generator import ContextualGeminiGenerator
from app.services.session_manager import session_manager
from app.services.rag.utils.logging_config import rag_logger

router = APIRouter(prefix="/api/rag", tags=["RAG System"])

# Initialize components
pipeline = IngestionPipeline()
# generator = MedicalGenerator()  # Keep as backup
generator = GeminiMedicalGenerator()  # Your current generator
contextual_generator = ContextualGeminiGenerator()  # NEW: Context-aware generator

# ============================================================================
# EXISTING ENDPOINTS (UNCHANGED - Full backward compatibility)
# ============================================================================

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

@router.get("/status", response_model=SystemStatusResponse)
async def get_system_status():
    """Get RAG system status with session info"""
    try:
        # Check vector store connection
        vector_connected = pipeline.vector_store.health_check()
        
        # Check embedding model
        embedding_loaded = pipeline.embedding_manager.model is not None
        
        # Get document count
        collection_info = pipeline.vector_store.get_collection_info()
        doc_count = collection_info.get("points_count", 0)
        
        # Check session manager health
        session_health = session_manager.health_check()
        
        system_ready = vector_connected and embedding_loaded and (session_health["status"] == "healthy")
        
        response_data = {
            "status": "ready" if system_ready else "not_ready",
            "vector_store_connected": vector_connected,
            "embedding_model_loaded": embedding_loaded,
            "documents_count": doc_count,
            "system_ready": system_ready
        }
        
        # Add session info to response (but keep schema compatible)
        rag_logger.info(f"System status check - Sessions: {session_health}")
        
        return SystemStatusResponse(**response_data)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# ENHANCED QUERY ENDPOINT (Backward compatible + NEW context features)
# ============================================================================

@router.post("/query", response_model=MedicalQueryResponse)
async def query_medical_knowledge(request: MedicalQueryRequest):
    """
    Query medical knowledge base with optional conversation context
    
    - Works exactly as before if no session_id provided
    - Uses conversation memory if session_id provided
    """
    try:
        # If session_id provided, use contextual generator
        if request.session_id:
            rag_logger.info(f"🧠 Using contextual generation for session: {request.session_id[:8]}...")
            result = await contextual_generator.generate_response(
                query=request.query,
                session_id=request.session_id,
                max_chunks=request.max_chunks
            )
        else:
            # Use regular generator (existing behavior)
            rag_logger.info("🤖 Using regular generation (no session)")
            result = await generator.generate_medical_response(
                query=request.query,
                max_chunks=request.max_chunks
            )
            
            # Add default session fields for compatibility
            result["session_id"] = "no-session"
            result["conversation_context_used"] = False
        
        # Ensure all required fields are present for MedicalQueryResponse
        response_data = {
            "success": result.get("success", True),
            "query": result.get("query", request.query),
            "response": result.get("response", ""),
            "session_id": result.get("session_id", "no-session"),
            "conversation_context_used": result.get("conversation_context_used", False),
            "sources": result.get("sources", []),
            "urgency_level": result.get("urgency_level", "routine"),
            "chunks_used": result.get("chunks_used", 0),
            "generation_time": result.get("generation_time", 0.0),
            "model_used": result.get("model_used", "gemini-1.5-flash"),
            "safety_validated": result.get("safety_validated", True),
            "emergency_detected": result.get("emergency_detected", False),
            "timestamp": result.get("timestamp", ""),
            "processing_time": result.get("generation_time", 0.0),  # Backward compatibility
            "error": result.get("error")
        }
        
        return MedicalQueryResponse(**response_data)
        
    except Exception as e:
        rag_logger.error(f"Query endpoint error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ============================================================================
# NEW ENDPOINTS: Session Management
# ============================================================================

@router.post("/session/new", response_model=SessionCreateResponse)
async def create_new_session():
    """Create a new conversation session"""
    try:
        session_id = session_manager.create_session()
        rag_logger.info(f"📱 Created new session via API: {session_id[:8]}...")
        
        return SessionCreateResponse(
            session_id=session_id,
            message="New conversation session created successfully"
        )
    except Exception as e:
        rag_logger.error(f"Session creation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create session")

@router.get("/session/{session_id}/history", response_model=SessionHistoryResponse)
async def get_session_history(session_id: str):
    """Get conversation history for a session"""
    try:
        session = session_manager.get_session(session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found or expired")
        
        return SessionHistoryResponse(
            session_id=session_id,
            messages=[msg.to_dict() for msg in session.messages],
            message_count=len(session.messages),
            created_at=session.created_at.isoformat(),
            updated_at=session.updated_at.isoformat()
        )
    except HTTPException:
        raise
    except Exception as e:
        rag_logger.error(f"Get session history error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve session history")

@router.get("/session/{session_id}/status", response_model=SessionStatusResponse)
async def get_session_status(session_id: str):
    """Check if session exists and get basic info"""
    try:
        session = session_manager.get_session(session_id)
        
        if session:
            return SessionStatusResponse(
                session_id=session_id,
                exists=True,
                message_count=len(session.messages),
                last_activity=session.updated_at.isoformat()
            )
        else:
            return SessionStatusResponse(
                session_id=session_id,
                exists=False
            )
    except Exception as e:
        rag_logger.error(f"Session status error: {e}")
        raise HTTPException(status_code=500, detail="Failed to check session status")

@router.post("/session/{session_id}/clear")
async def clear_session_history(session_id: str):
    """Clear conversation history for a session"""
    try:
        success = session_manager.clear_session(session_id)
        if not success:
            raise HTTPException(status_code=404, detail="Session not found")
        
        rag_logger.info(f"🧹 Cleared session via API: {session_id[:8]}...")
        return {"message": f"Session history cleared successfully", "session_id": session_id}
        
    except HTTPException:
        raise
    except Exception as e:
        rag_logger.error(f"Clear session error: {e}")
        raise HTTPException(status_code=500, detail="Failed to clear session")

@router.delete("/session/{session_id}")
async def delete_session(session_id: str):
    """Permanently delete a session"""
    try:
        success = session_manager.delete_session(session_id)
        if not success:
            raise HTTPException(status_code=404, detail="Session not found")
        
        rag_logger.info(f"🗑️ Deleted session via API: {session_id[:8]}...")
        return {"message": "Session deleted successfully", "session_id": session_id}
        
    except HTTPException:
        raise
    except Exception as e:
        rag_logger.error(f"Delete session error: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete session")

@router.get("/sessions/active")
async def get_active_sessions(limit: int = Query(50, ge=1, le=100)):
    """Get list of active sessions (for admin/debugging)"""
    try:
        # Cleanup expired sessions first
        session_manager._maybe_cleanup()
        
        active_sessions = []
        session_count = 0
        
        for session_id, session in list(session_manager._active_sessions.items()):
            if session_count >= limit:
                break
                
            active_sessions.append({
                "session_id": session_id,
                "message_count": len(session.messages),
                "created_at": session.created_at.isoformat(),
                "updated_at": session.updated_at.isoformat(),
                "age_hours": (session_manager._last_cleanup - session.created_at).total_seconds() / 3600
            })
            session_count += 1
        
        # Get session manager health
        health_info = session_manager.health_check()
        
        return {
            "active_sessions": active_sessions,
            "total_active_count": len(session_manager._active_sessions),
            "returned_count": len(active_sessions),
            "storage_health": health_info,
            "session_storage_path": str(session_manager.storage_path)
        }
        
    except Exception as e:
        rag_logger.error(f"Get active sessions error: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve active sessions")

# ============================================================================
# NEW ENDPOINT: Unified Chat (Recommended for frontend)
# ============================================================================

@router.post("/chat", response_model=ChatResponse)
async def chat_with_memory(request: ChatRequest):
    """
    Unified chat endpoint with automatic session management
    
    - Auto-creates session if none provided
    - Uses conversation memory automatically
    - Recommended for frontend integration
    """
    try:
        # Get or create session
        session_id = request.session_id
        if not session_id:
            session_id = session_manager.create_session()
            rag_logger.info(f"🆕 Auto-created session for chat: {session_id[:8]}...")
        else:
            # Validate session exists
            if not session_manager.get_session(session_id):
                rag_logger.warning(f"⚠️ Session not found, creating new: {session_id[:8]}...")
                session_id = session_manager.create_session()
        
        # Generate contextual response
        result = await contextual_generator.generate_response(
            query=request.query,
            session_id=session_id,
            max_chunks=request.max_chunks or 3
        )
        
        if not result["success"]:
            # Don't raise exception, return error response
            return ChatResponse(
                success=False,
                query=request.query,
                response=result.get("response", "I apologize, but I encountered an error processing your request."),
                session_id=session_id,
                conversation_context_used=result.get("conversation_context_used", False),
                sources=[],
                generation_time=result.get("generation_time", 0.0),
                timestamp=result.get("timestamp", ""),
                error=result.get("error", "Unknown error")
            )
        
        return ChatResponse(
            success=True,
            query=request.query,
            response=result["response"],
            session_id=result["session_id"],
            conversation_context_used=result.get("conversation_context_used", False),
            sources=result.get("sources", []),
            generation_time=result.get("generation_time", 0.0),
            timestamp=result.get("timestamp", ""),
            error=None
        )
        
    except HTTPException:
        raise
    except Exception as e:
        rag_logger.error(f"Chat endpoint error: {e}")
        
        # Graceful error handling
        return ChatResponse(
            success=False,
            query=request.query,
            response="I apologize, but I'm experiencing technical difficulties. Please try again or contact support if the problem persists.",
            session_id=session_id if 'session_id' in locals() else "error",
            conversation_context_used=False,
            sources=[],
            generation_time=0.0,
            timestamp="",
            error=str(e)
        )
