from typing import List
import numpy as np
from sentence_transformers import SentenceTransformer
from app.config import settings
from app.services.rag.utils.logging_config import rag_logger

class EmbeddingManager:
    def __init__(self):
        self.model_name = settings.embedding_model_name
        self.model = None
        self._initialize_model()
    
    def _initialize_model(self):
        try:
            rag_logger.info(f"Loading embedding model: {self.model_name}")
            self.model = SentenceTransformer(self.model_name)
            rag_logger.info("✅ Embedding model loaded successfully")
        except Exception as e:
            rag_logger.error(f"❌ Failed to load embedding model: {e}")
            raise
    
    def embed_texts(self, texts: List[str]) -> np.ndarray:
        if not self.model:
            raise ValueError("Embedding model not initialized")
        
        if not texts:
            return np.array([])
        
        try:
            embeddings = self.model.encode(
                texts,
                batch_size=settings.embedding_batch_size,
                show_progress_bar=True,
                convert_to_numpy=True
            )
            rag_logger.info(f"Generated embeddings for {len(texts)} texts")
            return embeddings
        except Exception as e:
            rag_logger.error(f"Embedding generation failed: {e}")
            raise
    
    def embed_single_text(self, text: str) -> np.ndarray:
        return self.embed_texts([text])[0]
