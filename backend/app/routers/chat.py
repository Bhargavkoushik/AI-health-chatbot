from fastapi import APIRouter
import time 
from app.models.schemas import MedicalQueryRequest, MedicalQueryResponse 
from app.services.medical_agent import chatbot
from app.services.symptom_checker import symptom_checker # Keep the import just in case

router = APIRouter()
sessions = {}

@router.post("/chat", response_model=MedicalQueryResponse)
async def chat_endpoint(req: MedicalQueryRequest, session_id: str = "default"):
    start_time = time.time()
    
    # --- MODIFICATION START ---
    # We are bypassing the rigid symptom_checker to allow our advanced RAG chatbot
    # to handle all queries. This ensures a consistent and intelligent user experience.
    
    response_text = chatbot(req.query)
    
    # --- MODIFICATION END ---
    
    # The old logic is commented out below for your reference.
    # session = sessions.get(session_id, {})
    # response_text, updated_session = symptom_checker(req.query, session) 
    # if not response_text:
    #     response_text = chatbot(req.query)
    # sessions[session_id] = updated_session

    # Format the response to match the MedicalQueryResponse model
    return MedicalQueryResponse(
        success=True,
        query=req.query,
        response=response_text,
        sources=[], # You can populate this later if your chatbot returns sources
        processing_time=time.time() - start_time
    )
