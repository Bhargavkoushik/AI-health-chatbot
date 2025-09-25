# Prescription Analyzer Setup Guide

This guide will help you set up the Prescription Analysis feature for the AI Health Chatbot.

## Prerequisites

### System Requirements
- Python 3.8 or higher
- Node.js 14 or higher
- Tesseract OCR
- Git

### For Windows Users

1. **Install Tesseract OCR:**
   - Download from: https://github.com/UB-Mannheim/tesseract/wiki
   - Install to the default location: `C:\Program Files\Tesseract-OCR\`
   - Add to PATH environment variable

2. **Verify Installation:**
   ```cmd
   tesseract --version
   ```

### For macOS Users

1. **Install Tesseract using Homebrew:**
   ```bash
   brew install tesseract
   ```

### For Linux Users (Ubuntu/Debian)

1. **Install Tesseract:**
   ```bash
   sudo apt update
   sudo apt install tesseract-ocr
   sudo apt install libtesseract-dev
   ```

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Virtual Environment
```bash
python -m venv venv

# For Windows
venv\Scripts\activate

# For macOS/Linux
source venv/bin/activate
```

### 3. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 4. Download spaCy Language Model
```bash
python -m spacy download en_core_web_sm
```

### 5. Set Environment Variables
Create a `.env` file in the backend directory:
```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
ENVIRONMENT=development

# CORS Origins
CORS_ORIGINS=["http://localhost:3000", "http://localhost:5173"]

# Tesseract Path (Windows only)
TESSERACT_PATH=C:\Program Files\Tesseract-OCR\tesseract.exe
```

### 6. Prepare Drug Interaction Database
Ensure you have the drug interaction CSV file in the correct location:
```
backend/app/data/db_drug_interactions.csv
```

The CSV should have columns: `DrugA`, `DrugB`, `Severity`, `Interaction`

### 7. Run the Backend Server
```bash
# For development
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# For production
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd client
```

### 2. Install Node.js Dependencies
```bash
npm install
```

### 3. Set Environment Variables
Create a `.env` file in the client directory:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_APP_NAME="AI Health Chatbot"
```

### 4. Run the Frontend Development Server
```bash
npm run dev
```

## Testing the Feature

### 1. Access the Application
- Frontend: http://localhost:3000 (or http://localhost:5173 for Vite)
- Backend API Docs: http://localhost:8000/docs

### 2. Navigate to Prescription Analyzer
- Go to `/prescription-analyzer` route in your browser
- Upload a prescription image (JPEG, PNG, GIF) or PDF
- Click "Analyze Prescription"

### 3. Expected Results
The system should:
- Extract text from the image using OCR
- Identify medicine names, dosages, and frequencies
- Check for drug interactions
- Provide warnings and recommendations

## Troubleshooting

### Common Issues

#### 1. Tesseract Not Found Error
```
Error: TesseractNotFoundError
```
**Solution:**
- Verify Tesseract is installed correctly
- Check PATH environment variable
- For Windows, ensure the path in the code matches your installation

#### 2. spaCy Model Not Found
```
OSError: [E050] Can't find model 'en_core_web_sm'
```
**Solution:**
```bash
python -m spacy download en_core_web_sm
```

#### 3. Drug Interaction Database Not Found
```
FileNotFoundError: Drug interaction database not found
```
**Solution:**
- Ensure the CSV file exists at `backend/app/data/db_drug_interactions.csv`
- The system will use fallback data if the file is missing

#### 4. CORS Issues
```
Access to fetch at 'http://localhost:8000' from origin 'http://localhost:3000' has been blocked by CORS policy
```
**Solution:**
- Check CORS configuration in `backend/app/main.py`
- Ensure frontend URL is in the allowed origins list

#### 5. File Upload Issues
```
413 Request Entity Too Large
```
**Solution:**
- Check file size (maximum 5MB)
- Verify file type is supported (JPEG, PNG, GIF, PDF)

### Performance Optimization

1. **Image Preprocessing:**
   - Ensure images are clear and well-lit
   - Higher resolution images generally work better
   - Remove shadows and glare

2. **OCR Accuracy:**
   - Use images with good contrast
   - Ensure text is horizontal (not rotated)
   - Avoid handwritten prescriptions if possible

## File Structure

After setup, your project structure should look like:

```
AI-health-chatbot/
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   │   └── prescription.py        # API endpoints
│   │   ├── services/
│   │   │   └── prescription_analyzer.py # Core logic
│   │   ├── models/
│   │   │   └── prescription_schema.py  # Data models
│   │   ├── utils/
│   │   │   └── ocr_utils.py           # OCR utilities
│   │   └── data/
│   │       └── db_drug_interactions.csv # Drug database
│   ├── requirements.txt                 # Dependencies
│   └── .env                            # Environment variables
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   └── prescription.js         # API calls
│   │   ├── pages/
│   │   │   └── PrescriptionAnalysisPage.jsx # Main page
│   │   ├── components/
│   │   │   └── PrescriptionResultCard.jsx   # Result display
│   │   └── App.jsx                     # Route configuration
│   ├── package.json                    # Dependencies
│   └── .env                           # Environment variables
└── README.md                          # This file
```

## API Documentation

Once the backend is running, visit http://localhost:8000/docs for interactive API documentation.

### Key Endpoints:
- `POST /api/prescription/analyze` - Analyze prescription image/PDF
- `GET /api/prescription/health` - Health check for the service

## Contributing

For contributing to this feature:

1. Create feature branches for different components
2. Write unit tests for backend services
3. Add proper error handling
4. Update documentation
5. Follow the existing code style

## Security Considerations

1. **File Validation:** Only accept specific file types and sizes
2. **Data Privacy:** Don't store sensitive medical information
3. **Input Sanitization:** Validate all inputs before processing
4. **Rate Limiting:** Consider adding rate limiting for production

## Production Deployment

For production deployment:

1. Use environment variables for all configuration
2. Set up proper logging and monitoring
3. Configure reverse proxy (Nginx)
4. Use HTTPS
5. Set up database for storing analysis results (optional)
6. Consider using cloud OCR services for better accuracy