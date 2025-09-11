import time
from typing import Dict, Any

from app.services.rag.ingestion.ingestion_pipeline import IngestionPipeline
from app.services.rag.utils.logging_config import rag_logger

class MedicalGenerator:
    def __init__(self):
        self.pipeline = IngestionPipeline()
    
    async def generate_response(self, query: str, max_chunks: int = 3) -> Dict[str, Any]:
        start_time = time.time()
        
        try:
            # Generate query embedding
            query_embedding = self.pipeline.embedding_manager.embed_single_text(query)
            
            # Search for relevant documents
            search_results = self.pipeline.vector_store.search_similar(
                query_embedding.tolist(),
                limit=max_chunks
            )
            
            if not search_results:
                return {
                    "success": False,
                    "query": query,
                    "response": "I don't have specific information about your query in my medical knowledge base. Please consult with a healthcare professional for accurate medical advice.",
                    "sources": [],
                    "processing_time": time.time() - start_time,
                    "error": "No relevant information found"
                }
            
            # Build context from search results
            context_parts = []
            sources = []
            
            for result in search_results:
                context_parts.append(result["text"])
                sources.append(result["source"])
            
            context = "\n\n".join(context_parts)
            
            # Generate medical response
            response = self._generate_medical_response(query, context)
            
            return {
                "success": True,
                "query": query,
                "response": response,
                "sources": list(set(sources)),
                "processing_time": time.time() - start_time
            }
            
        except Exception as e:
            rag_logger.error(f"Response generation failed: {e}")
            return {
                "success": False,
                "query": query,
                "response": "I'm experiencing technical difficulties. Please try again later or consult a healthcare professional.",
                "sources": [],
                "processing_time": time.time() - start_time,
                "error": str(e)
            }
    
    def _generate_medical_response(self, query: str, context: str) -> str:
        # Simple template-based response generation
        # In production, this would use an LLM like GPT or similar
        
        response = f"""**Medical Information Response**

Based on your query about: "{query}"

**Relevant Medical Information:**
{context}

**Important Medical Disclaimer:**
⚠️ This information is for educational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers for medical concerns.

**When to Seek Medical Care:**
- If symptoms persist or worsen
- For proper diagnosis and treatment
- If you have concerns about your health
- For emergency situations, call 911 immediately

**Source:** Medical Knowledge Database
"""
        
        return response
