from typing import List
import json
import pandas as pd
from pathlib import Path
from langchain_core.documents import Document

from app.services.rag.utils.logging_config import rag_logger

class DocumentLoader:
    def load_documents(self, file_paths: List[str]) -> List[Document]:
        documents = []
        
        for file_path in file_paths:
            try:
                path = Path(file_path)
                
                if not path.exists():
                    rag_logger.warning(f"File not found: {file_path}")
                    continue
                
                if path.suffix == '.json':
                    docs = self._load_json(file_path)
                elif path.suffix == '.csv':
                    docs = self._load_csv(file_path)
                elif path.suffix == '.txt':
                    docs = self._load_text(file_path)
                else:
                    rag_logger.warning(f"Unsupported file type: {path.suffix}")
                    continue
                
                documents.extend(docs)
                rag_logger.info(f"✅ Loaded {len(docs)} documents from {path.name}")
                
            except Exception as e:
                rag_logger.error(f"❌ Failed to load {file_path}: {e}")
                continue
        
        return documents
    
    def _load_json(self, file_path: str) -> List[Document]:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        documents = []
        if isinstance(data, list):
            for item in data:
                if isinstance(item, dict) and 'content' in item:
                    doc = Document(
                        page_content=item['content'],
                        metadata={
                            'source': file_path,
                            'condition': item.get('condition', 'unknown'),
                            'category': item.get('category', 'general')
                        }
                    )
                    documents.append(doc)
        
        return documents
    
    def _load_csv(self, file_path: str) -> List[Document]:
        df = pd.read_csv(file_path)
        documents = []
        
        for _, row in df.iterrows():
            content = ' '.join([str(val) for val in row.values if pd.notna(val)])
            doc = Document(
                page_content=content,
                metadata={'source': file_path, 'row_index': row.name}
            )
            documents.append(doc)
        
        return documents
    
    def _load_text(self, file_path: str) -> List[Document]:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        doc = Document(
            page_content=content,
            metadata={'source': file_path}
        )
        
        return [doc]
