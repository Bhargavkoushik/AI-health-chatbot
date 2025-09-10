from typing import List
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

from app.config import settings
from app.services.rag.utils.logging_config import rag_logger

class ChunkingStrategy:
    def __init__(self):
        self.chunk_size = settings.chunk_size
        self.chunk_overlap = settings.chunk_overlap
    
    def chunk_documents(self, documents: List[Document], strategy: str = "medical") -> List[Document]:
        if strategy == "medical":
            return self._medical_chunking(documents)
        else:
            return self._default_chunking(documents)
    
    def _medical_chunking(self, documents: List[Document]) -> List[Document]:
        medical_separators = [
            "\n\nSYMPTOMS:",
            "\n\nTREATMENT:",
            "\n\nCAUSES:",
            "\n\nPREVENTION:",
            "\n\nWHEN TO SEE DOCTOR:",
            "\n\n",
            "\n",
            ". ",
            " "
        ]
        
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            separators=medical_separators
        )
        
        chunks = text_splitter.split_documents(documents)
        
        for i, chunk in enumerate(chunks):
            chunk.metadata.update({
                'chunk_id': i,
                'chunking_strategy': 'medical'
            })
        
        rag_logger.info(f"Created {len(chunks)} medical chunks")
        return chunks
    
    def _default_chunking(self, documents: List[Document]) -> List[Document]:
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap
        )
        
        chunks = text_splitter.split_documents(documents)
        rag_logger.info(f"Created {len(chunks)} default chunks")
        return chunks
