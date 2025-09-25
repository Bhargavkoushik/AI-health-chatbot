from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import JSONResponse
# Use mock analyzer until Tesseract is installed
from app.services.prescription_analyzer_mock import analyze_prescription
from typing import Dict, Any
import logging

router = APIRouter(prefix="/api/prescription", tags=["Prescription"])
logger = logging.getLogger(__name__)

# Allowed file types
ALLOWED_CONTENT_TYPES = [
    "image/jpeg", 
    "image/jpg", 
    "image/png", 
    "image/gif", 
    "application/pdf"
]

# Maximum file size (5MB)
MAX_FILE_SIZE = 5 * 1024 * 1024

@router.post("/analyze", response_model=Dict[str, Any])
async def analyze_prescription_endpoint(file: UploadFile = File(...)):
    """
    Analyze a prescription image or PDF to extract medicines and check for drug interactions.
    
    - **file**: Upload an image (JPEG, PNG, GIF) or PDF containing a prescription
    - Returns: Analysis results including extracted medicines, interactions, warnings, and recommendations
    """
    try:
        # Validate file type
        if file.content_type not in ALLOWED_CONTENT_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type {file.content_type} not supported. Please upload an image (JPEG, PNG, GIF) or PDF."
            )
        
        # Read file content
        file_content = await file.read()
        
        # Validate file size
        if len(file_content) > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File size too large. Maximum size is {MAX_FILE_SIZE // (1024*1024)}MB."
            )
        
        # Validate file is not empty
        if len(file_content) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Uploaded file is empty."
            )
        
        # Analyze prescription (supports both async and sync analyzers)
        logger.info(f"Analyzing prescription file: {file.filename} ({file.content_type}, {len(file_content)} bytes)")
        result = analyze_prescription(file_content, file.filename or "unknown")
        if hasattr(result, "__await__"):
            analysis = await result
        else:
            analysis = result
        
        # Return successful response
        return {
            "success": True,
            "message": "Prescription analyzed successfully",
            "analysis": analysis.dict(),
            "timestamp": analysis.uploaded_at.isoformat()
        }
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error analyzing prescription: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )

@router.get("/health")
async def health_check():
    """Health check endpoint for prescription analysis service"""
    try:
        # You can add more comprehensive health checks here
        return {
            "status": "healthy",
            "service": "prescription-analyzer",
            "timestamp": "2025-09-24T00:00:00Z"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Service unhealthy"
        )
