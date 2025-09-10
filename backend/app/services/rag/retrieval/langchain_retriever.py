from typing import List, Dict, Any, Optional
import asyncio
import time
from datetime import datetime

from langchain_qdrant import QdrantVectorStore
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.schema import Document

from app.config import settings
from app.services.rag.utils.logging_config import rag_logger


class LangChainMedicalRetriever:
    """LangChain-based medical document retriever with Qdrant"""
    
    def __init__(self):
        self.vector_store = None
        self.embeddings = None
        self._initialize_components()
    
    def _initialize_components(self):
        """Initialize LangChain components"""
        try:
            # Initialize embeddings (SentenceTransformers, 384d)
            self.embeddings = HuggingFaceEmbeddings(
                model_name=settings.embedding_model_name
            )
            
            # Initialize Qdrant vector store
            self.vector_store = QdrantVectorStore.from_existing_collection(
                collection_name=settings.qdrant_collection_name,
                embedding=self.embeddings,
                url=settings.qdrant_url,
            )
            
            rag_logger.info("✅ LangChain retriever initialized successfully (HuggingFace embeddings)")
            
        except Exception as e:
            rag_logger.error(f"❌ Failed to initialize LangChain retriever: {e}")
            raise
    
    async def retrieve_documents(
        self, 
        query: str, 
        k: int = 3,
        filter_dict: Optional[Dict] = None
    ) -> List[Document]:
        """Retrieve relevant documents using LangChain"""
        
        try:
            start_time = time.time()
            
            # Create retriever with custom search parameters
            retriever = self.vector_store.as_retriever(
                search_type="similarity",
                search_kwargs={
                    "k": k,
                    "filter": filter_dict
                }
            )
            
            # Retrieve documents
            documents = await retriever.ainvoke(query)
            
            retrieval_time = time.time() - start_time
            
            rag_logger.info(f"🔍 Retrieved {len(documents)} documents in {retrieval_time:.3f}s")
            
            # Add retrieval metadata
            for doc in documents:
                doc.metadata.update({
                    "retrieval_time": retrieval_time,
                    "query": query,
                    "timestamp": datetime.now().isoformat()
                })
            
            return documents
            
        except Exception as e:
            rag_logger.error(f"❌ Document retrieval failed: {e}")
            return []
    
    async def similarity_search_with_score(
        self, 
        query: str, 
        k: int = 3
    ) -> List[tuple]:
        """Retrieve documents with similarity scores"""
        
        try:
            results = await self.vector_store.asimilarity_search_with_score(
                query=query,
                k=k
            )
            
            rag_logger.info(f"🎯 Retrieved {len(results)} documents with scores")
            return results
            
        except Exception as e:
            rag_logger.error(f"❌ Similarity search failed: {e}")
            return []
    
    def get_retriever(self, **kwargs):
        """Get LangChain retriever object for use in chains"""
        return self.vector_store.as_retriever(**kwargs)
