import pytesseract
from PIL import Image
import fitz  # PyMuPDF
import io
from typing import Union
import logging
import spacy
import re
from app.models.prescription import MedicineInfo

class OCRService:
    def __init__(self):
        # Configure tesseract path for Windows
        pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    
    async def extract_text(self, file_content: bytes, file_type: str) -> str:
        try:
            if file_type.lower() == 'pdf':
                return await self._extract_from_pdf(file_content)
            else:
                return await self._extract_from_image(file_content)
        except Exception as e:
            logging.error(f"OCR extraction failed: {e}")
            raise
    
    async def _extract_from_pdf(self, pdf_content: bytes) -> str:
        doc = fitz.open(stream=pdf_content, filetype="pdf")
        text = ""
        for page in doc:
            # Try text extraction first
            page_text = page.get_text()
            if page_text.strip():
                text += page_text
            else:
                # Fall back to OCR for scanned PDFs
                pix = page.get_pixmap()
                img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                text += pytesseract.image_to_string(img)
        doc.close()
        return text
    
    async def _extract_from_image(self, image_content: bytes) -> str:
        image = Image.open(io.BytesIO(image_content))
        return pytesseract.image_to_string(image)

class NERService:
    def __init__(self):
        # Load pre-trained model (you might need to train a custom model for medical entities)
        self.nlp = spacy.load("en_core_web_sm")
        
        # Common medicine patterns and dosage patterns
        self.medicine_patterns = [
            r'\b[A-Z][a-z]+(?:cillin|mycin|prazole|olol|pine|tide)\b',  # Common drug suffixes
            r'\b(?:Tablet|Tab|Capsule|Cap|Syrup|Injection)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
        ]
        
        self.dosage_patterns = [
            r'(\d+(?:\.\d+)?)\s*(?:mg|g|ml|units?)',
            r'(\d+(?:\.\d+)?)\s*(?:milligrams?|grams?|milliliters?)',
        ]
        
        self.frequency_patterns = [
            r'(?:take|use)\s+(\d+)\s+(?:times?\s+(?:a\s+)?(?:day|daily))',
            r'(?:once|twice|thrice)\s+(?:a\s+)?(?:day|daily)',
            r'every\s+(\d+)\s+hours?',
            r'(\d+)\s*x\s*(?:daily|day)',
        ]
    
    async def extract_medicines(self, text: str) -> List[MedicineInfo]:
        medicines = []
        doc = self.nlp(text)
        
        # Extract using patterns
        for pattern in self.medicine_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                medicine_name = match.group(1) if match.groups() else match.group(0)
                
                # Find dosage and frequency near this medicine
                context = self._get_context(text, match.start(), match.end())
                dosage = self._extract_dosage(context)
                frequency = self._extract_frequency(context)
                
                medicines.append(MedicineInfo(
                    name=medicine_name.strip(),
                    dosage=dosage,
                    frequency=frequency,
                    confidence=0.8  # You can implement confidence scoring
                ))
        
        return medicines
    
    def _get_context(self, text: str, start: int, end: int, window: int = 100) -> str:
        context_start = max(0, start - window)
        context_end = min(len(text), end + window)
        return text[context_start:context_end]
    
    def _extract_dosage(self, context: str) -> str:
        for pattern in self.dosage_patterns:
            match = re.search(pattern, context, re.IGNORECASE)
            if match:
                return match.group(0)
        return "Not specified"
    
    def _extract_frequency(self, context: str) -> str:
        for pattern in self.frequency_patterns:
            match = re.search(pattern, context, re.IGNORECASE)
            if match:
                return match.group(0)
        return "Not specified"