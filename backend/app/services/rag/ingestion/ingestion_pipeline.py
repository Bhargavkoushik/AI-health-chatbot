import time
from typing import List, Dict, Any

from app.services.rag.ingestion.document_loader import DocumentLoader
from app.services.rag.ingestion.chunking_strategies import ChunkingStrategy
from app.services.rag.ingestion.embedding_manager import EmbeddingManager
from app.services.rag.ingestion.vectorstore_manager import VectorStoreManager
from app.services.rag.utils.logging_config import rag_logger

class IngestionPipeline:
    def __init__(self):
        self.document_loader = DocumentLoader()
        self.chunking_strategy = ChunkingStrategy()
        self.embedding_manager = EmbeddingManager()
        self.vector_store = VectorStoreManager()
    
    async def ingest_documents(self, 
                             file_paths: List[str],
                             chunking_strategy: str = "medical",
                             recreate_collection: bool = False) -> Dict[str, Any]:
        
        start_time = time.time()
        rag_logger.info("🚀 Starting document ingestion pipeline")
        
        try:
            # Step 1: Create collection
            self.vector_store.create_collection(recreate=recreate_collection)
            
            # Step 2: Load documents
            documents = self.document_loader.load_documents(file_paths)
            if not documents:
                return {
                    "success": False,
                    "error": "No documents loaded",
                    "processing_time": time.time() - start_time
                }
            
            # Step 3: Chunk documents
            chunks = self.chunking_strategy.chunk_documents(documents, chunking_strategy)
            
            # Step 4: Generate embeddings
            chunk_texts = [chunk.page_content for chunk in chunks]
            embeddings = self.embedding_manager.embed_texts(chunk_texts)
            
            # Step 5: Store in vector database
            document_ids = self.vector_store.add_documents(chunks, embeddings.tolist())
            
            processing_time = time.time() - start_time
            
            result = {
                "success": True,
                "processing_time": processing_time,
                "files_processed": len(file_paths),
                "documents_loaded": len(documents),
                "chunks_created": len(chunks),
                "documents_stored": len(document_ids)
            }
            
            rag_logger.info(f"✅ Ingestion completed in {processing_time:.2f} seconds")
            return result
            
        except Exception as e:
            rag_logger.error(f"❌ Ingestion failed: {e}")
            return {
                "success": False,
                "error": str(e),
                "processing_time": time.time() - start_time
            }
