from typing import List, Dict, Any
import uuid
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from langchain_core.documents import Document

from app.config import settings
from app.services.rag.utils.logging_config import rag_logger

class VectorStoreManager:
    def __init__(self):
        self.client = None
        self.collection_name = settings.qdrant_collection_name
        self.dimension = settings.embedding_dimension
        self._initialize_client()
    
    def _initialize_client(self):
        try:
            self.client = QdrantClient(url=settings.qdrant_url)
            rag_logger.info("✅ Connected to Qdrant")
        except Exception as e:
            rag_logger.error(f"❌ Failed to connect to Qdrant: {e}")
            raise
    
    def health_check(self) -> bool:
        try:
            self.client.get_collections()
            return True
        except:
            return False
    
    def create_collection(self, recreate: bool = False) -> bool:
        try:
            collections = self.client.get_collections()
            collection_exists = any(col.name == self.collection_name for col in collections.collections)
            
            if collection_exists and recreate:
                rag_logger.info(f"Deleting existing collection: {self.collection_name}")
                self.client.delete_collection(self.collection_name)
                collection_exists = False
            
            if not collection_exists:
                rag_logger.info(f"Creating collection: {self.collection_name}")
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=self.dimension, distance=Distance.COSINE)
                )
                rag_logger.info("✅ Collection created successfully")
            
            return True
        except Exception as e:
            rag_logger.error(f"❌ Collection creation failed: {e}")
            raise
    
    def add_documents(self, documents: List[Document], embeddings: List[List[float]]) -> List[str]:
        if len(documents) != len(embeddings):
            raise ValueError("Documents and embeddings count mismatch")
        
        try:
            points = []
            document_ids = []
            
            for i, (doc, embedding) in enumerate(zip(documents, embeddings)):
                point_id = str(uuid.uuid4())
                document_ids.append(point_id)
                
                point = PointStruct(
                    id=point_id,
                    vector=embedding,
                    payload={
                        "text": doc.page_content,
                        "metadata": doc.metadata,
                        "source": doc.metadata.get("source", "unknown")
                    }
                )
                points.append(point)
            
            self.client.upsert(collection_name=self.collection_name, points=points)
            rag_logger.info(f"✅ Added {len(points)} documents to vector store")
            
            return document_ids
        except Exception as e:
            rag_logger.error(f"❌ Failed to add documents: {e}")
            raise
    
    def search_similar(self, query_embedding: List[float], limit: int = 5) -> List[Dict[str, Any]]:
        try:
            results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_embedding,
                limit=limit
            )
            
            formatted_results = []
            for result in results:
                formatted_results.append({
                    "id": result.id,
                    "score": result.score,
                    "text": result.payload.get("text", ""),
                    "source": result.payload.get("source", "")
                })
            
            return formatted_results
        except Exception as e:
            rag_logger.error(f"❌ Search failed: {e}")
            return []
    
    def get_collection_info(self) -> Dict[str, Any]:
        try:
            info = self.client.get_collection(self.collection_name)
            return {
                "name": info.config.name,
                "points_count": info.points_count,
                "vector_size": info.config.params.vectors.size
            }
        except:
            return {"points_count": 0}
