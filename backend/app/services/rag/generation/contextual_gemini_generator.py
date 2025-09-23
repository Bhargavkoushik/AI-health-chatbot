import os
import time
from typing import Dict, Any, List, Optional
from datetime import datetime

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage, SystemMessage

from app.services.rag.retrieval.langchain_retriever import LangChainMedicalRetriever
from app.services.rag.generation.prompt_templates import MedicalPromptTemplates
from app.services.rag.generation.response_processor import MedicalResponseProcessor
from app.services.rag.utils.logging_config import rag_logger
from app.services.session_manager import session_manager
from app.config import settings

class ContextualGeminiGenerator:
    """Context-aware Gemini generator with conversation memory"""
    
    def __init__(self):
        self.retriever = LangChainMedicalRetriever()
        self.llm = self._initialize_gemini()
        self.prompt_templates = MedicalPromptTemplates()
        self.response_processor = MedicalResponseProcessor()
        rag_logger.info("🧠 ContextualGeminiGenerator initialized")
    
    def _initialize_gemini(self):
        """Initialize Gemini LLM with medical-optimized settings"""
        try:
            api_key = settings.google_api_key
            if not api_key:
                raise ValueError("GOOGLE_API_KEY not found in environment variables")
            
            llm = ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                google_api_key=api_key,
                temperature=0.1,
                max_tokens=1024,
                convert_system_message_to_human=True
            )
            
            rag_logger.info("✅ Contextual Gemini LLM initialized")
            return llm
            
        except Exception as e:
            rag_logger.error(f"❌ Failed to initialize Contextual Gemini: {e}")
            raise
    
    async def generate_response(self, 
                              query: str,
                              session_id: Optional[str] = None,
                              max_chunks: int = 3) -> Dict[str, Any]:
        """Generate context-aware medical response"""
        
        start_time = time.time()
        conversation_context_used = False
        
        try:
            rag_logger.info(f"🤖 Generating contextual response for: {query[:50]}...")
            
            # Get or create session
            if session_id:
                session = session_manager.get_session(session_id)
                if not session:
                    session_id = session_manager.create_session()
                    rag_logger.info(f"🆕 Created new session: {session_id[:8]}...")
            else:
                session_id = session_manager.create_session()
            
            # Get conversation history for context
            conversation_history = session_manager.get_conversation_context(session_id, max_messages=6)
            conversation_context_used = bool(conversation_history.strip())
            
            # Add user message to session
            session_manager.add_message(session_id, "user", query)
            
            # Enhance query with conversation context for better retrieval
            enhanced_query = self._enhance_query_with_context(query, conversation_history)
            
            # Retrieve relevant medical documents
            documents = await self.retriever.retrieve_documents(
                query=enhanced_query,
                k=max_chunks
            )
            
            if not documents:
                return self._create_fallback_response(query, session_id, "No relevant medical information found")
            
            # Build medical context
            medical_context = "\n\n".join([doc.page_content for doc in documents])
            sources = [doc.metadata.get("source", "Unknown") for doc in documents]
            
            # Analyze for medical urgency
            emergency_analysis = self.response_processor.detect_emergency_keywords(query)
            urgency_level = emergency_analysis.get("urgency_level", "routine")
            
            # Generate contextual response
            response_text = await self._generate_with_context(
                current_query=query,
                conversation_history=conversation_history,
                medical_context=medical_context,
                urgency_level=urgency_level
            )
            
            # Process response
            cleaned_response = self.response_processor.clean_response_text(response_text)
            final_response = cleaned_response  # ✅ Clean response without disclaimers
            # final_response = self.response_processor.add_safety_disclaimers(
            #     cleaned_response, urgency_level
            # )
            
            # Format with metadata
            generation_time = time.time() - start_time
            metadata = {
                "model_used": "gemini-1.5-flash-contextual",
                "generation_time": generation_time,
                "timestamp": datetime.now().isoformat(),
                "session_id": session_id,
                "conversation_context_used": conversation_context_used
            }
            
            formatted_response = self.response_processor.format_medical_response(
                final_response, sources, metadata
            )
            
            # Add assistant response to session
            session_manager.add_message(
                session_id, 
                "assistant", 
                formatted_response,
                {"sources": sources, "generation_time": generation_time}
            )
            
            # Validate safety
            safety_validation = self.response_processor.validate_response_safety(formatted_response)
            
            result = {
                "success": True,
                "query": query,
                "response": formatted_response,
                "session_id": session_id,
                "conversation_context_used": conversation_context_used,
                "sources": list(set(sources)),
                "urgency_level": urgency_level,
                "chunks_used": len(documents),
                "generation_time": generation_time,
                "model_used": "gemini-1.5-flash-contextual",
                "safety_validated": safety_validation["is_safe"],
                "emergency_detected": emergency_analysis.get("is_emergency", False),
                "timestamp": datetime.now().isoformat()
            }
            
            rag_logger.info(f"✅ Generated contextual response in {generation_time:.2f}s (Context: {conversation_context_used})")
            return result
            
        except Exception as e:
            rag_logger.error(f"❌ Contextual generation failed: {e}")
            return self._create_fallback_response(query, session_id or "unknown", str(e))
    
    def _enhance_query_with_context(self, query: str, conversation_history: str) -> str:
        """Enhance query with conversation context for better retrieval"""
        if not conversation_history.strip():
            return query
            
        # Extract medical keywords from conversation
        context_keywords = self._extract_medical_keywords(conversation_history)
        
        if context_keywords:
            # Add context to query for better semantic search
            enhanced = f"{query} (context: {' '.join(context_keywords[:3])})"
            rag_logger.debug(f"Enhanced query: {enhanced}")
            return enhanced
        
        return query
    
    def _extract_medical_keywords(self, text: str) -> List[str]:
        """Extract medical keywords from conversation"""
        medical_terms = [
            'headache', 'fever', 'pain', 'symptoms', 'diabetes', 'pressure',
            'heart', 'chest', 'breathing', 'cough', 'throat', 'stomach',
            'nausea', 'dizzy', 'fatigue', 'tired', 'sleep', 'stress',
            'medication', 'treatment', 'doctor', 'hospital', 'emergency'
        ]
        
        text_lower = text.lower()
        found_terms = [term for term in medical_terms if term in text_lower]
        return found_terms[:5]  # Limit for query enhancement
    
    async def _generate_with_context(self, 
                                   current_query: str, 
                                   conversation_history: str,
                                   medical_context: str,
                                   urgency_level: str) -> str:
        """Generate response with full conversation context"""
        try:
            # Create contextual prompt
            context_prompt = self._build_contextual_prompt(
                current_query=current_query,
                conversation_history=conversation_history,
                medical_context=medical_context,
                urgency_level=urgency_level
            )
            
            # Generate with Gemini
            response = await self.llm.ainvoke([HumanMessage(content=context_prompt)])
            return response.content
            
        except Exception as e:
            rag_logger.error(f"Contextual Gemini generation error: {e}")
            raise
    
    def _build_contextual_prompt(self, 
                                current_query: str,
                                conversation_history: str,
                                medical_context: str,
                                urgency_level: str) -> str:
        """Build context-aware prompt for Gemini"""
        
        context_instruction = ""
        if conversation_history.strip():
            context_instruction = f"""
CONVERSATION HISTORY:
{conversation_history}

IMPORTANT: Use this conversation history to provide contextually relevant responses. Reference previous topics when appropriate (e.g., "Regarding the headaches you mentioned earlier...").
"""
        else:
            context_instruction = "This is the beginning of our conversation."
        
        urgency_note = ""
        if urgency_level == "emergency":
            urgency_note = "⚠️ MEDICAL EMERGENCY DETECTED - Prioritize immediate care guidance."
        elif urgency_level == "high":
            urgency_note = "⚠️ URGENT MEDICAL CONCERN - Emphasize timely medical consultation."
        
        prompt = f"""You are MediBot, a caring AI health assistant providing contextually aware medical information.

{context_instruction}

CURRENT MEDICAL CONTEXT:
{medical_context}

{urgency_note}

USER'S CURRENT QUESTION: {current_query}

RESPONSE GUIDELINES:
1. **Context Awareness**: Reference relevant parts of our conversation history naturally
2. **Medical Accuracy**: Use only the provided medical context for health information  
3. **Natural Flow**: Make the conversation feel continuous and caring
4. **Safety First**: Include appropriate medical disclaimers
5. **Human-like**: Never mention "documents", "context", or internal processes

Please provide a helpful, contextually aware response that feels like a natural continuation of our conversation."""

        return prompt
    
    def _create_fallback_response(self, query: str, session_id: str, error_message: str) -> Dict[str, Any]:
        """Create contextual fallback response"""
        
        # Get some conversation context for personalized fallback
        conversation_context = session_manager.get_conversation_context(session_id, max_messages=2)
        
        greeting = ""
        if conversation_context and "User:" in conversation_context:
            greeting = "I understand we've been discussing your health concerns, and "
        
        fallback_content = f"""{greeting}I apologize, but I'm experiencing technical difficulties with your question about "{query}".

**For your health needs:**
- **Urgent concerns:** Contact your healthcare provider immediately
- **Emergencies:** Call 911 or visit your nearest emergency room
- **General questions:** Try rephrasing your question or consult trusted medical websites

**Remember:** I provide educational health information only and cannot replace professional medical advice.

*Technical note: {error_message}*"""
        
        # Add fallback to session
        session_manager.add_message(session_id, "assistant", fallback_content)
        
        return {
            "success": False,
            "query": query,
            "response": fallback_content,
            "session_id": session_id,
            "conversation_context_used": bool(conversation_context),
            "sources": [],
            "error": error_message,
            "timestamp": datetime.now().isoformat()
        }
