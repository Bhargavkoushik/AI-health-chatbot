import os
import time
from typing import Dict, Any, List
from datetime import datetime

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage, SystemMessage

from app.services.rag.retrieval.langchain_retriever import LangChainMedicalRetriever
from app.services.rag.generation.prompt_templates import MedicalPromptTemplates
from app.services.rag.generation.response_processor import MedicalResponseProcessor
from app.services.rag.utils.logging_config import rag_logger
from app.config import settings

class GeminiMedicalGenerator:
    """Complete Gemini LLM integration for medical response generation"""
    
    def __init__(self):
        self.retriever = LangChainMedicalRetriever()
        self.llm = self._initialize_gemini()
        self.prompt_templates = MedicalPromptTemplates()
        self.response_processor = MedicalResponseProcessor()
    
    def _initialize_gemini(self):
        """Initialize Gemini LLM with medical-optimized settings"""
        try:
            # api_key = os.getenv("GOOGLE_API_KEY")
            api_key = settings.google_api_key
            if not api_key:
                raise ValueError("GOOGLE_API_KEY not found in environment variables")
            
            llm = ChatGoogleGenerativeAI(
                model="gemini-1.5-flash",
                google_api_key=api_key,
                temperature=0.1,  # Low temperature for medical accuracy
                max_tokens=1024,
                convert_system_message_to_human=True  # Gemini compatibility
            )
            
            rag_logger.info("✅ Gemini LLM initialized successfully")
            return llm
            
        except Exception as e:
            rag_logger.error(f"❌ Failed to initialize Gemini: {e}")
            raise
    
    async def generate_medical_response(self, 
                                      query: str,
                                      max_chunks: int = 3) -> Dict[str, Any]:
        """Generate comprehensive medical response using Gemini + RAG"""
        
        start_time = time.time()
        
        try:
            rag_logger.info(f"🤖 Generating Gemini response for: {query[:50]}...")
            
            # Step 1: Analyze query for urgency and safety
            emergency_analysis = self.response_processor.detect_emergency_keywords(query)
            
            # Step 2: Retrieve relevant medical context
            documents = await self.retriever.retrieve_documents(
                query=query,
                k=max_chunks
            )
            
            if not documents:
                return self._create_fallback_response(query, "No relevant medical information found")
            
            # Step 3: Build context from retrieved documents
            context = "\n\n".join([doc.page_content for doc in documents])
            sources = [doc.metadata.get("source", "Unknown") for doc in documents]
            
            # Step 4: Select appropriate prompt template
            if emergency_analysis["is_emergency"]:
                prompt_template = self.prompt_templates.get_emergency_prompt()
                urgency_level = "emergency"
            elif "symptom" in query.lower():
                prompt_template = self.prompt_templates.get_symptom_analysis_prompt()
                urgency_level = "high" if any(word in query.lower() for word in ["severe", "acute", "sudden"]) else "routine"
            elif any(word in query.lower() for word in ["treatment", "medication", "therapy"]):
                prompt_template = self.prompt_templates.get_treatment_info_prompt()
                urgency_level = "routine"
            else:
                prompt_template = self.prompt_templates.get_medical_qa_prompt()
                urgency_level = "routine"
            
            # Step 5: Generate response with Gemini
            response_text = await self._generate_with_gemini(
                query, context, prompt_template
            )
            
            # Step 6: Post-process response
            cleaned_response = self.response_processor.clean_response_text(response_text)
            
            # Step 7: Add safety disclaimers
            final_response = self.response_processor.add_safety_disclaimers(
                cleaned_response, urgency_level
            )
            
            # Step 8: Format with sources and metadata
            generation_time = time.time() - start_time
            metadata = {
                "model_used": "gemini-1.5-flash",
                "generation_time": generation_time,
                "timestamp": datetime.now().isoformat()
            }
            
            formatted_response = self.response_processor.format_medical_response(
                final_response, sources, metadata
            )
            
            # Step 9: Validate safety
            safety_validation = self.response_processor.validate_response_safety(formatted_response)
            
            result = {
                "success": True,
                "query": query,
                "response": formatted_response,
                "sources": list(set(sources)),
                "urgency_level": urgency_level,
                "chunks_used": len(documents),
                "generation_time": generation_time,
                "model_used": "gemini-1.5-flash",
                "safety_validated": safety_validation["is_safe"],
                "emergency_detected": emergency_analysis["is_emergency"],
                "timestamp": datetime.now().isoformat()
            }
            
            rag_logger.info(f"✅ Generated safe medical response in {generation_time:.2f}s")
            return result
            
        except Exception as e:
            rag_logger.error(f"❌ Gemini generation failed: {e}")
            return self._create_fallback_response(query, str(e))
    
    async def _generate_with_gemini(self, query: str, context: str, prompt_template) -> str:
        """Generate response using Gemini LLM"""
        try:
            # Format the prompt
            messages = prompt_template.format_messages(
                context=context,
                question=query
            )
            
            # Generate response with Gemini
            response = await self.llm.ainvoke(messages)
            
            return response.content
            
        except Exception as e:
            rag_logger.error(f"Gemini API error: {e}")
            raise
    
    def _create_fallback_response(self, query: str, error_message: str) -> Dict[str, Any]:
        """Create safe fallback response when generation fails"""
        
        fallback_content = f"""I apologize, but I'm experiencing technical difficulties processing your medical query about "{query}".

**For immediate assistance:**
- **Urgent medical concerns:** Contact your healthcare provider immediately
- **Emergencies:** Call 911 or go to the nearest emergency room  
- **General health information:** Try rephrasing your question or consult reputable medical websites like MedlinePlus or Mayo Clinic

**Important:** This system provides educational health information only and cannot replace professional medical advice, diagnosis, or treatment.

*Technical issue: {error_message}*"""
        
        return {
            "success": False,
            "query": query,
            "response": fallback_content,
            "sources": [],
            "urgency_level": "unknown",
            "error": error_message,
            "timestamp": datetime.now().isoformat()
        }
