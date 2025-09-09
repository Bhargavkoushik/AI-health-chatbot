from typing import Optional, List, Tuple
from functools import lru_cache
import numpy as np
from sentence_transformers import SentenceTransformer
import faiss

try:
    from transformers import pipeline
except ImportError:
    pipeline = None

_MODEL_MAP = {
    ("hi", "en"): "Helsinki-NLP/opus-mt-hi-en",
    ("mr", "en"): "Helsinki-NLP/opus-mt-mr-en",
    ("te", "en"): "Helsinki-NLP/opus-mt-te-en",
    ("en", "hi"): "Helsinki-NLP/opus-mt-en-hi",
    ("en", "mr"): "Helsinki-NLP/opus-mt-en-mr",
    ("en", "te"): "Helsinki-NLP/opus-mt-en-te",
}

_MODEL_NAME = "paraphrase-multilingual-MiniLM-L12-v2"
_model = None

@lru_cache(maxsize=8)
def _get_pipeline(src: str, tgt: str):
    if pipeline is None:
        raise RuntimeError("transformers not installed")
    model = _MODEL_MAP.get((src, tgt))
    if model is None:
        raise ValueError(f"No direct HF model for {src}->{tgt}")
    return pipeline("translation", model=model)

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(_MODEL_NAME)
    return _model

def embed_texts(texts: List[str]) -> np.ndarray:
    model = get_model()
    embs = model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
    if embs.ndim == 1:
        embs = embs.reshape(1, -1)
    return embs

def translate(text: str, src_lang: str, tgt_lang: str) -> str:
    if src_lang == tgt_lang:
        return text
    try:
        p = _get_pipeline(src_lang, tgt_lang)
        out = p(text, max_length=1024)
        return out[0]["translation_text"]
    except Exception:
        return text

class FaissRetriever:
    def __init__(self, dim: int = None):
        self.index = None
        self.docs = []
        self.dim = dim

    def build(self, docs: List[str]):
        self.docs = docs
        embs = embed_texts(docs)
        self.dim = embs.shape[1]
        self.index = faiss.IndexFlatIP(self.dim)
        faiss.normalize_L2(embs)
        self.index.add(embs)

    def query(self, q: str, top_k: int = 5) -> List[Tuple[str, float]]:
        q_emb = embed_texts([q])
        faiss.normalize_L2(q_emb)
        D, I = self.index.search(q_emb, top_k)
        results = []
        for idx, score in zip(I[0], D[0]):
            if idx == -1:
                continue
            results.append((self.docs[idx], float(score)))
        return results