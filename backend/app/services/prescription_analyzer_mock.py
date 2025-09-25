"""
Mock prescription analyzer for testing without Tesseract
"""
import re
from typing import List, Dict, Tuple, Optional
from datetime import datetime
import uuid
import logging
from pydantic import BaseModel
import pandas as pd

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define models directly here
class MedicineInfo(BaseModel):
    name: str
    dosage: str
    frequency: str
    confidence: float

class DrugInteraction(BaseModel):
    drug1: str
    drug2: str
    severity: str
    description: str

class PrescriptionAnalysis(BaseModel):
    id: str
    uploaded_at: datetime
    raw_text: str
    medicines: List[MedicineInfo]
    interactions: List[DrugInteraction]
    warnings: List[str]
    recommendations: List[str]
    status: str

class MockPrescriptionAnalyzer:
    def __init__(self):
        # Create fallback drug interaction database
        self.drug_db = self._create_fallback_drug_db()
        
        # Medicine patterns for extraction
        self.medicine_patterns = [
            r'\b[A-Z][a-z]*(?:cillin|mycin|prazole|olol|pine|tide|caine|azole|statin)\b',
            r'\b(?:Digoxin|Furosemide|Busulfan|Augmentin|Enalapril|PanD|Hexigel)\b',
            r'\b([A-Z][a-z]{2,})\s+(?:\d+\s*(?:mg|ml|g))',
        ]

    def _create_fallback_drug_db(self) -> pd.DataFrame:
        interactions = [
            {"DrugA": "Digoxin", "DrugB": "Furosemide", "Severity": "High", "Interaction": "Risk of digoxin toxicity due to electrolyte imbalance"},
            {"DrugA": "Warfarin", "DrugB": "Aspirin", "Severity": "High", "Interaction": "Increased bleeding risk"},
            {"DrugA": "Metformin", "DrugB": "Alcohol", "Severity": "Moderate", "Interaction": "Risk of lactic acidosis"},
            {"DrugA": "Augmentin", "DrugB": "Warfarin", "Severity": "Moderate", "Interaction": "May increase anticoagulant effect"},
        ]
        return pd.DataFrame(interactions)

    async def analyze_prescription_image(self, file_content: bytes, filename: str) -> PrescriptionAnalysis:
        try:
            # Mock OCR - simulate text extraction from uploaded image
            # Note: file_content contains the actual uploaded image bytes
            _ = file_content  # Acknowledge parameter (used in real implementation)
            
            # For demo purposes, we'll simulate extracting text from the prescription images you showed
            mock_text = """
            Patient: Mr. Sachin Bansage
            Date: 12/10/23
            
            Prescription:
            1. Tab. Augmentin 625mg - 1-0-1 x 5days (after meals)
            2. Tab. Enalapril - 1-0-1 x 5days  
            3. Tab. PanD 40mg - 1-0-0 x 5days (before meals)
            
            Advice: Hexigel gum paint massage - 1-0-1 x 1week
            
            Doctor's Signature
            """
            
            if "Digoxin" in filename or "digoxin" in filename.lower():
                mock_text = """
                Prescription:
                Digoxin 0.25mg
                Prednisolone 5mg
                Busulfan 2mg
                
                Instructions:
                Take as directed by physician
                """
            
            # Extract medicines using pattern matching
            medicines = self._extract_medicines_mock(mock_text)
            
            # Check drug interactions
            interactions = self._check_drug_interactions(medicines)
            
            # Generate warnings and recommendations
            warnings, recommendations = self._generate_advice(medicines, interactions)
            
            # Create analysis result
            analysis = PrescriptionAnalysis(
                id=str(uuid.uuid4()),
                uploaded_at=datetime.now(),
                raw_text=mock_text,
                medicines=medicines,
                interactions=interactions,
                warnings=warnings,
                recommendations=recommendations,
                status="completed"
            )
            
            logger.info(f"Mock analysis completed: {len(medicines)} medicines found, {len(interactions)} interactions")
            return analysis
            
        except Exception as e:
            logger.error(f"Mock analysis failed: {str(e)}")
            return PrescriptionAnalysis(
                id=str(uuid.uuid4()),
                uploaded_at=datetime.now(),
                raw_text="",
                medicines=[],
                interactions=[],
                warnings=[f"Analysis failed: {str(e)}"],
                recommendations=["Please try uploading a clearer image"],
                status="error"
            )

    def _extract_medicines_mock(self, text: str) -> List[MedicineInfo]:
        medicines = []
        
        # Extract common medicine names from the text
        medicine_data = [
            {"name": "Augmentin", "dosage": "625mg", "frequency": "1-0-1 x 5days"},
            {"name": "Enalapril", "dosage": "5mg", "frequency": "1-0-1 x 5days"},
            {"name": "PanD", "dosage": "40mg", "frequency": "1-0-0 x 5days"},
            {"name": "Digoxin", "dosage": "0.25mg", "frequency": "Once daily"},
            {"name": "Prednisolone", "dosage": "5mg", "frequency": "As directed"},
            {"name": "Busulfan", "dosage": "2mg", "frequency": "As directed"},
        ]
        
        for med_info in medicine_data:
            if med_info["name"].lower() in text.lower():
                medicines.append(MedicineInfo(
                    name=med_info["name"],
                    dosage=med_info["dosage"],
                    frequency=med_info["frequency"],
                    confidence=0.9
                ))
        
        return medicines

    def _check_drug_interactions(self, medicines: List[MedicineInfo]) -> List[DrugInteraction]:
        interactions = []
        
        if len(medicines) < 2:
            return interactions
        
        # Check all pairs
        for i in range(len(medicines)):
            for j in range(i + 1, len(medicines)):
                drug1 = medicines[i].name.lower()
                drug2 = medicines[j].name.lower()
                
                interaction = self._find_interaction(drug1, drug2) or self._find_interaction(drug2, drug1)
                
                if interaction:
                    interactions.append(DrugInteraction(
                        drug1=medicines[i].name,
                        drug2=medicines[j].name,
                        severity=interaction['Severity'].lower(),
                        description=interaction['Interaction']
                    ))
        
        return interactions

    def _find_interaction(self, drug1: str, drug2: str) -> Optional[Dict]:
        try:
            match = self.drug_db[
                (self.drug_db['DrugA'].str.lower() == drug1) & 
                (self.drug_db['DrugB'].str.lower() == drug2)
            ]
            
            if not match.empty:
                return match.iloc[0].to_dict()
            
            return None
        except Exception as e:
            logger.error(f"Error finding interaction: {e}")
            return None

    def _generate_advice(self, medicines: List[MedicineInfo], interactions: List[DrugInteraction]) -> Tuple[List[str], List[str]]:
        warnings = []
        recommendations = []
        
        for interaction in interactions:
            if interaction.severity == "high":
                warnings.append(f"🚨 HIGH RISK: {interaction.description} between {interaction.drug1} and {interaction.drug2}")
                recommendations.append(f"URGENT: Consult your doctor about {interaction.drug1} and {interaction.drug2}")
            elif interaction.severity == "moderate":
                warnings.append(f"⚠️ MODERATE RISK: {interaction.description} between {interaction.drug1} and {interaction.drug2}")
        
        if len(medicines) == 0:
            recommendations.append("No medicines detected. Please ensure the image is clear.")
        elif len(interactions) == 0:
            recommendations.append("No dangerous interactions detected.")
        
        recommendations.extend([
            "Always take medications as prescribed",
            "Keep a list of all your medications",
            "Inform all healthcare providers about your current medications"
        ])
        
        return warnings, recommendations

# Create global instance
mock_analyzer = MockPrescriptionAnalyzer()

async def analyze_prescription(file_content: bytes, filename: str) -> PrescriptionAnalysis:
    """Mock analyze prescription function for testing without OCR"""
    return await mock_analyzer.analyze_prescription_image(file_content, filename)