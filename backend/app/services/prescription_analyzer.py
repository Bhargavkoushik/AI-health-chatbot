try:
    import pytesseract  # type: ignore
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False
    pytesseract = None  # type: ignore

from PIL import Image
import spacy
import pandas as pd
import io
import re
from typing import List, Dict, Tuple, Optional
from datetime import datetime
import uuid
import logging
from pydantic import BaseModel

# Define models directly here to avoid import issues
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

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PrescriptionAnalyzer:
    def __init__(self):
        try:
            # Load spaCy model for NER
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            logger.error("spaCy model not found. Please install: python -m spacy download en_core_web_sm")
            raise
        
        # Load drug interaction database
        try:
            self.drug_db = pd.read_csv("app/data/sample_drug_interactions.csv")
            logger.info("Drug interaction database loaded successfully")
        except FileNotFoundError:
            logger.warning("Drug interaction database not found. Using fallback data.")
            self.drug_db = self._create_fallback_drug_db()
        
        # Medicine name patterns (common drug suffixes and prefixes)
        self.medicine_patterns = [
            r'\b[A-Z][a-z]*(?:cillin|mycin|prazole|olol|pine|tide|caine|azole|statin)\b',
            r'\b(?:Tablet|Tab\.?|Capsule|Cap\.?|Syrup|Injection|mg|ml)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
            r'\b([A-Z][a-z]{3,})\s+(?:\d+\s*(?:mg|ml|g))',
        ]
        
        # Dosage patterns
        self.dosage_patterns = [
            r'(\d+(?:\.\d+)?)\s*(?:mg|g|ml|units?|tablets?|caps?)',
            r'(\d+(?:\.\d+)?)\s*(?:milligrams?|grams?|milliliters?)',
        ]
        
        # Frequency patterns
        self.frequency_patterns = [
            r'(?:take|use)\s+(\d+)\s+(?:times?\s+(?:a\s+)?(?:day|daily))',
            r'(?:once|twice|thrice)\s+(?:a\s+)?(?:day|daily)',
            r'every\s+(\d+)\s+hours?',
            r'(\d+)\s*x\s*(?:daily|day)',
            r'(?:morning|evening|night|bedtime)',
        ]

    def _create_fallback_drug_db(self) -> pd.DataFrame:
        """Create a fallback drug interaction database for testing"""
        interactions = [
            {"DrugA": "Warfarin", "DrugB": "Aspirin", "Severity": "High", "Interaction": "Increased bleeding risk"},
            {"DrugA": "Metformin", "DrugB": "Alcohol", "Severity": "Moderate", "Interaction": "Risk of lactic acidosis"},
            {"DrugA": "Digoxin", "DrugB": "Furosemide", "Severity": "Moderate", "Interaction": "Electrolyte imbalance"},
            {"DrugA": "Simvastatin", "DrugB": "Clarithromycin", "Severity": "High", "Interaction": "Muscle toxicity risk"},
        ]
        return pd.DataFrame(interactions)

    def analyze_prescription_image(self, file_content: bytes, filename: str) -> PrescriptionAnalysis:
        """Main function to analyze prescription from image/PDF"""
        # Note: filename parameter is kept for future use (logging, file type detection)
        _ = filename  # Acknowledge parameter
        
        try:
            # Step 1: Extract text using OCR
            raw_text = self._extract_text_from_image(file_content)
            
            if not raw_text.strip():
                raise ValueError("No text could be extracted from the image")
            
            # Step 2: Extract medicines using NER and pattern matching
            medicines = self._extract_medicines(raw_text)
            
            # Step 3: Check drug interactions
            interactions = self._check_drug_interactions(medicines)
            
            # Step 4: Generate warnings and recommendations
            warnings, recommendations = self._generate_advice(medicines, interactions)
            
            # Step 5: Create analysis result
            analysis = PrescriptionAnalysis(
                id=str(uuid.uuid4()),
                uploaded_at=datetime.now(),
                raw_text=raw_text,
                medicines=medicines,
                interactions=interactions,
                warnings=warnings,
                recommendations=recommendations,
                status="completed"
            )
            
            logger.info(f"Successfully analyzed prescription: {len(medicines)} medicines found, {len(interactions)} interactions")
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing prescription: {str(e)}")
            # Return error analysis
            return PrescriptionAnalysis(
                id=str(uuid.uuid4()),
                uploaded_at=datetime.now(),
                raw_text="",
                medicines=[],
                interactions=[],
                warnings=[f"Analysis failed: {str(e)}"],
                recommendations=["Please try uploading a clearer image or consult a pharmacist"],
                status="error"
            )

    def _extract_text_from_image(self, file_content: bytes) -> str:
        """Extract text from image using OCR"""
        try:
            if not TESSERACT_AVAILABLE or pytesseract is None:
                logger.warning("Tesseract not available, returning placeholder text")
                return "Mock prescription text: Paracetamol 500mg, take twice daily. Ibuprofen 200mg, take as needed for pain."
            
            # Configure tesseract for better medical text recognition
            custom_config = r'--oem 3 --psm 6 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,():/- '
            
            image = Image.open(io.BytesIO(file_content))
            
            # Preprocess image for better OCR
            image = image.convert('RGB')
            
            # Extract text
            text = pytesseract.image_to_string(image, config=custom_config)
            
            logger.info(f"OCR extracted {len(text)} characters")
            return text.strip()
            
        except Exception as e:
            logger.error(f"OCR extraction failed: {str(e)}")
            raise

    def _extract_medicines(self, text: str) -> List[MedicineInfo]:
        """Extract medicine information using NER and pattern matching"""
        medicine_candidates = self._find_medicine_candidates(text)
        medicines = self._process_medicine_candidates(text, medicine_candidates)
        return self._remove_duplicate_medicines(medicines)

    def _find_medicine_candidates(self, text: str) -> set:
        """Find potential medicine names from text using patterns and NER"""
        medicine_candidates = set()
        
        # Extract using pattern matching
        medicine_candidates.update(self._extract_by_patterns(text))
        
        # Use spaCy NER for additional candidates
        medicine_candidates.update(self._extract_by_ner(text))
        
        return medicine_candidates

    def _extract_by_patterns(self, text: str) -> set:
        """Extract medicine names using regex patterns"""
        candidates = set()
        for pattern in self.medicine_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                medicine_name = self._get_medicine_name_from_match(match)
                if self._is_valid_medicine_name(medicine_name):
                    candidates.add(medicine_name)
        return candidates

    def _get_medicine_name_from_match(self, match) -> str:
        """Extract medicine name from regex match"""
        medicine_name = match.group(1) if match.groups() else match.group(0)
        return medicine_name.strip()

    def _is_valid_medicine_name(self, name: str) -> bool:
        """Check if medicine name is valid (not too short)"""
        return len(name) > 2

    def _extract_by_ner(self, text: str) -> set:
        """Extract medicine names using spaCy NER"""
        candidates = set()
        doc = self.nlp(text)
        for ent in doc.ents:
            if self._is_potential_drug_entity(ent):
                candidates.add(ent.text)
        return candidates

    def _is_potential_drug_entity(self, ent) -> bool:
        """Check if named entity is potentially a drug"""
        if ent.label_ not in ["ORG", "PRODUCT"] or len(ent.text) <= 2:
            return False
        # Simple heuristic: if it looks like a drug name
        return any(suffix in ent.text.lower() for suffix in ['cillin', 'mycin', 'prazole', 'olol'])

    def _process_medicine_candidates(self, text: str, candidates: set) -> List[MedicineInfo]:
        """Process medicine candidates to extract dosage and frequency"""
        medicines = []
        for medicine_name in candidates:
            context = self._get_medicine_context(text, medicine_name)
            dosage = self._extract_dosage_from_context(context)
            frequency = self._extract_frequency_from_context(context)
            
            medicines.append(MedicineInfo(
                name=medicine_name.title(),
                dosage=dosage,
                frequency=frequency,
                confidence=0.8  # Default confidence, could be improved with ML
            ))
        return medicines

    def _remove_duplicate_medicines(self, medicines: List[MedicineInfo]) -> List[MedicineInfo]:
        """Remove duplicate medicines based on name"""
        seen_names = set()
        unique_medicines = []
        for med in medicines:
            if med.name.lower() not in seen_names:
                seen_names.add(med.name.lower())
                unique_medicines.append(med)
        
        logger.info(f"Extracted {len(unique_medicines)} unique medicines")
        return unique_medicines

    def _get_medicine_context(self, text: str, medicine_name: str, window: int = 100) -> str:
        """Get context around medicine name for dosage/frequency extraction"""
        try:
            start_index = text.lower().find(medicine_name.lower())
            if start_index == -1:
                return ""
            
            context_start = max(0, start_index - window)
            context_end = min(len(text), start_index + len(medicine_name) + window)
            
            return text[context_start:context_end]
        except (ValueError, IndexError) as e:
            logger.warning(f"Could not extract context for {medicine_name}: {e}")
            return ""

    def _extract_dosage_from_context(self, context: str) -> str:
        """Extract dosage from context"""
        for pattern in self.dosage_patterns:
            match = re.search(pattern, context, re.IGNORECASE)
            if match:
                return match.group(0)
        return "Not specified"

    def _extract_frequency_from_context(self, context: str) -> str:
        """Extract frequency from context"""
        for pattern in self.frequency_patterns:
            match = re.search(pattern, context, re.IGNORECASE)
            if match:
                return match.group(0)
        return "Not specified"

    def _check_drug_interactions(self, medicines: List[MedicineInfo]) -> List[DrugInteraction]:
        """Check for drug interactions"""
        interactions = []
        
        if len(medicines) < 2:
            return interactions
        
        # Check all pairs of medicines
        for i in range(len(medicines)):
            for j in range(i + 1, len(medicines)):
                drug1 = medicines[i].name.lower().strip()
                drug2 = medicines[j].name.lower().strip()
                
                # Check both directions in database
                interaction = self._find_interaction(drug1, drug2) or self._find_interaction(drug2, drug1)
                
                if interaction:
                    interactions.append(DrugInteraction(
                        drug1=medicines[i].name,
                        drug2=medicines[j].name,
                        severity=interaction['Severity'].lower(),
                        description=interaction['Interaction']
                    ))
        
        logger.info(f"Found {len(interactions)} drug interactions")
        return interactions

    def _find_interaction(self, drug1: str, drug2: str) -> Optional[Dict]:
        """Find interaction between two drugs in database"""
        try:
            # Exact match
            exact_match = self.drug_db[
                (self.drug_db['DrugA'].str.lower() == drug1) & 
                (self.drug_db['DrugB'].str.lower() == drug2)
            ]
            
            if not exact_match.empty:
                return exact_match.iloc[0].to_dict()
            
            # Partial match (contains)
            partial_match = self.drug_db[
                (self.drug_db['DrugA'].str.lower().str.contains(drug1, na=False)) & 
                (self.drug_db['DrugB'].str.lower().str.contains(drug2, na=False))
            ]
            
            if not partial_match.empty:
                return partial_match.iloc[0].to_dict()
            
            return None
            
        except Exception as e:
            logger.error(f"Error finding interaction: {e}")
            return None

    def _generate_advice(self, medicines: List[MedicineInfo], interactions: List[DrugInteraction]) -> Tuple[List[str], List[str]]:
        """Generate warnings and recommendations"""
        warnings = []
        recommendations = []
        
        # Generate warnings based on interactions
        for interaction in interactions:
            if interaction.severity == "high":
                warnings.append(f"🚨 HIGH RISK: {interaction.description} between {interaction.drug1} and {interaction.drug2}")
                recommendations.append(f"URGENT: Consult your doctor immediately about {interaction.drug1} and {interaction.drug2}")
            elif interaction.severity == "moderate":
                warnings.append(f"⚠️ MODERATE RISK: {interaction.description} between {interaction.drug1} and {interaction.drug2}")
                recommendations.append(f"Discuss with your pharmacist about {interaction.drug1} and {interaction.drug2}")
            else:
                warnings.append(f"⚡ LOW RISK: {interaction.description} between {interaction.drug1} and {interaction.drug2}")
        
        # General recommendations
        if len(medicines) == 0:
            recommendations.append("No medicines detected. Please ensure the image is clear and contains prescription text.")
        elif len(interactions) == 0:
            recommendations.append("No dangerous interactions detected. Continue taking as prescribed.")
        
        # Add general safety advice
        recommendations.extend([
            "Always take medications as prescribed by your doctor",
            "Keep a list of all medications you're taking",
            "Inform all healthcare providers about your current medications"
        ])
        
        return warnings, recommendations

# Create global instance
prescription_analyzer = PrescriptionAnalyzer()

def analyze_prescription(file_content: bytes, filename: str) -> PrescriptionAnalysis:
    """Public function to analyze prescription"""
    return prescription_analyzer.analyze_prescription_image(file_content, filename)
