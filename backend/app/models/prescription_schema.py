from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class MedicineInfo(BaseModel):
    name: str
    dosage: str
    frequency: str
    confidence: float

class DrugInteraction(BaseModel):
    drug1: str
    drug2: str
    severity: str  # low, moderate, high
    description: str

class PrescriptionAnalysis(BaseModel):
    id: str
    uploaded_at: datetime
    raw_text: str
    medicines: List[MedicineInfo]
    interactions: List[DrugInteraction]
    warnings: List[str]
    recommendations: List[str]
    status: str  # processing, completed, error