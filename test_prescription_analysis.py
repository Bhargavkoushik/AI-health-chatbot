"""
Test script for Prescription Analysis functionality
Run this script to test the prescription analysis without the full web interface
"""

import asyncio
import sys
import os
from pathlib import Path

# Add the app directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from app.services.prescription_analyzer import analyze_prescription
import base64

async def test_prescription_analysis():
    """Test the prescription analysis with sample data"""
    
    print("🧪 Testing Prescription Analysis...")
    print("=" * 50)
    
    # Test with sample text (simulating OCR output)
    sample_prescription_text = """
    Dr. John Smith, MD
    Medical Center
    
    Patient: Jane Doe
    Date: 2025-09-24
    
    Prescription:
    
    1. Metformin 500mg
       Take 2 tablets twice daily with meals
       
    2. Lisinopril 10mg
       Take 1 tablet once daily in the morning
       
    3. Simvastatin 20mg
       Take 1 tablet once daily at bedtime
       
    4. Aspirin 81mg
       Take 1 tablet once daily
       
    Follow up in 3 months
    
    Dr. Smith
    """
    
    try:
        # Create a simple test image with text
        from PIL import Image, ImageDraw, ImageFont
        import io
        
        # Create a simple image with prescription text
        img = Image.new('RGB', (800, 600), color='white')
        draw = ImageDraw.Draw(img)
        
        # Use default font
        try:
            font = ImageFont.load_default()
        except:
            font = None
        
        # Add text to image
        text_lines = sample_prescription_text.strip().split('\n')
        y_position = 20
        
        for line in text_lines:
            if line.strip():
                draw.text((20, y_position), line.strip(), fill='black', font=font)
                y_position += 25
        
        # Convert image to bytes
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='PNG')
        img_bytes = img_byte_arr.getvalue()
        
        print("📄 Created test prescription image")
        print(f"📏 Image size: {len(img_bytes)} bytes")
        
        # Analyze the prescription
        result = await analyze_prescription(img_bytes, "test_prescription.png")
        
        print("\n📊 Analysis Results:")
        print("=" * 30)
        
        print(f"✅ Status: {result.status}")
        print(f"🆔 ID: {result.id}")
        print(f"📅 Analyzed at: {result.uploaded_at}")
        
        print(f"\n💊 Medicines Found: {len(result.medicines)}")
        for i, medicine in enumerate(result.medicines, 1):
            print(f"  {i}. {medicine.name}")
            print(f"     Dosage: {medicine.dosage}")
            print(f"     Frequency: {medicine.frequency}")
            print(f"     Confidence: {medicine.confidence:.2%}")
        
        print(f"\n⚠️  Drug Interactions: {len(result.interactions)}")
        for i, interaction in enumerate(result.interactions, 1):
            print(f"  {i}. {interaction.drug1} + {interaction.drug2}")
            print(f"     Severity: {interaction.severity}")
            print(f"     Description: {interaction.description}")
        
        print(f"\n⚠️  Warnings: {len(result.warnings)}")
        for i, warning in enumerate(result.warnings, 1):
            print(f"  {i}. {warning}")
        
        print(f"\n💡 Recommendations: {len(result.recommendations)}")
        for i, recommendation in enumerate(result.recommendations, 1):
            print(f"  {i}. {recommendation}")
        
        print(f"\n📝 Extracted Text (first 200 chars):")
        print(f"   {result.raw_text[:200]}...")
        
        print("\n🎉 Test completed successfully!")
        return True
        
    except Exception as e:
        print(f"\n❌ Test failed with error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

async def test_api_health():
    """Test the prescription analysis service health"""
    print("\n🏥 Testing Service Health...")
    print("=" * 30)
    
    try:
        from app.services.prescription_analyzer import prescription_analyzer
        print("✅ Prescription analyzer service initialized successfully")
        
        # Test drug database loading
        if hasattr(prescription_analyzer, 'drug_db'):
            print(f"📊 Drug interaction database loaded: {len(prescription_analyzer.drug_db)} interactions")
        
        # Test spaCy model
        if hasattr(prescription_analyzer, 'nlp'):
            print("🧠 spaCy NLP model loaded successfully")
            
            # Test simple text processing
            doc = prescription_analyzer.nlp("Test medicine Aspirin 100mg")
            print(f"🔍 NLP test successful: {len(doc.ents)} entities found")
        
        print("✅ All health checks passed!")
        return True
        
    except Exception as e:
        print(f"❌ Health check failed: {str(e)}")
        return False

def check_dependencies():
    """Check if all required dependencies are installed"""
    print("📦 Checking Dependencies...")
    print("=" * 25)
    
    required_modules = [
        'pytesseract',
        'PIL',
        'spacy',
        'pandas',
        'numpy',
        'fitz',  # PyMuPDF
        'fastapi',
        'pydantic'
    ]
    
    missing_modules = []
    
    for module in required_modules:
        try:
            if module == 'PIL':
                from PIL import Image
                print(f"✅ PIL (Pillow): Available")
            elif module == 'fitz':
                import fitz
                print(f"✅ PyMuPDF: Available")
            else:
                __import__(module)
                print(f"✅ {module}: Available")
        except ImportError:
            print(f"❌ {module}: Missing")
            missing_modules.append(module)
    
    if missing_modules:
        print(f"\n⚠️  Missing dependencies: {', '.join(missing_modules)}")
        print("Run: pip install -r requirements.txt")
        return False
    else:
        print("\n🎉 All dependencies are installed!")
        return True

def main():
    """Main test function"""
    print("🚀 Prescription Analysis Test Suite")
    print("=" * 40)
    
    # Check dependencies first
    if not check_dependencies():
        print("\n❌ Dependency check failed. Please install missing dependencies.")
        return
    
    # Run async tests
    async def run_tests():
        health_ok = await test_api_health()
        if health_ok:
            analysis_ok = await test_prescription_analysis()
            
            if analysis_ok:
                print("\n🎊 All tests passed! The prescription analysis feature is working correctly.")
            else:
                print("\n⚠️  Some tests failed. Please check the error messages above.")
        else:
            print("\n⚠️  Health check failed. Please resolve the issues before running analysis tests.")
    
    # Run the tests
    asyncio.run(run_tests())

if __name__ == "__main__":
    main()