"""
Simple test script for prescription analyzer
"""
import sys
import os
import asyncio

# Add app to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

async def test_basic_functionality():
    print("🧪 Testing basic imports...")
    
    try:
        import pytesseract
        print("✅ pytesseract imported successfully")
    except ImportError as e:
        print(f"❌ pytesseract import failed: {e}")
        return False
    
    try:
        from PIL import Image
        print("✅ PIL imported successfully")
    except ImportError as e:
        print(f"❌ PIL import failed: {e}")
        return False
    
    try:
        import spacy
        print("✅ spacy imported successfully")
        
        # Test loading the model
        nlp = spacy.load("en_core_web_sm")
        print("✅ spaCy model loaded successfully")
    except Exception as e:
        print(f"❌ spaCy model loading failed: {e}")
        return False
    
    try:
        import pandas as pd
        print("✅ pandas imported successfully")
    except ImportError as e:
        print(f"❌ pandas import failed: {e}")
        return False
    
    print("\n🧪 Testing prescription analyzer...")
    
    try:
        from app.services.prescription_analyzer import analyze_prescription
        print("✅ prescription_analyzer imported successfully")
        
        # Create a simple test image
        from PIL import Image, ImageDraw
        import io
        
        img = Image.new('RGB', (400, 200), color='white')
        draw = ImageDraw.Draw(img)
        draw.text((10, 10), "Digoxin 0.25mg\nTake once daily", fill='black')
        
        # Convert to bytes
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format='PNG')
        img_bytes = img_byte_arr.getvalue()
        
        # Test analysis
        result = await analyze_prescription(img_bytes, "test.png")
        print(f"✅ Analysis completed! Status: {result.status}")
        print(f"📊 Found {len(result.medicines)} medicines")
        
        for med in result.medicines:
            print(f"   - {med.name}: {med.dosage}, {med.frequency}")
        
        if result.interactions:
            print(f"⚠️  Found {len(result.interactions)} interactions")
        
        return True
        
    except Exception as e:
        print(f"❌ prescription_analyzer test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("🚀 Starting prescription analyzer tests...")
    success = asyncio.run(test_basic_functionality())
    
    if success:
        print("\n🎉 All tests passed! Ready to run the server.")
    else:
        print("\n❌ Some tests failed. Please check the errors above.")