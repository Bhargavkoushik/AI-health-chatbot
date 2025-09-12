# 🤖 MediBot: AI Health Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GSSoC '25](https://img.shields.io/badge/GSSoC-%2725-blue)](https://gssoc.girlscript.tech/)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED.svg)](https://www.docker.com/)

> **An intelligent, conversational AI Health Assistant that provides safe, contextually aware, and empathetic health information through advanced RAG (Retrieval-Augmented Generation) technology.**

![MediBot Demo](https://github.com/user-attachments/assets/08cc8775-ec98-47ce-a0db-1df7714bbbaa)

---

## 📖 Table of Contents

- [🌟 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [⚙️ Configuration](#️-configuration)
- [🧪 Testing the System](#-testing-the-system)
- [🔬 API Documentation](#-api-documentation)
- [🎯 Features Roadmap](#-features-roadmap)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👥 Contributors](#-contributors)

---

## 🌟 Overview

**MediBot** represents a significant evolution in AI-powered healthcare assistance, transitioning from simple rule-based responses to a sophisticated, full-stack application powered by modern artificial intelligence. This project bridges the gap between users and healthcare information by offering intelligent, contextually aware health guidance.

### 🎯 What Makes MediBot Special?

- **Advanced RAG Pipeline**: Unlike traditional chatbots, MediBot uses Retrieval-Augmented Generation to understand context, retrieve relevant medical information, and synthesize accurate responses
- **Human-Like Conversations**: Powered by Google's Gemini models with carefully crafted prompts that ensure natural, empathetic interactions
- **Safety-First Design**: Every response includes mandatory medical disclaimers and escalation guidance
- **Modern Architecture**: Full-stack application with React frontend, FastAPI backend, and Qdrant vector database
- **Docker-Ready**: Fully containerized for consistent development and deployment

> ⚠️ **Important Disclaimer**: MediBot is designed for educational and informational purposes only. It is **not a replacement** for professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical concerns.

---

## ✨ Key Features

### 🧠 **Intelligent Symptom Analysis**
- **Natural Language Processing**: Understands complex symptom descriptions in everyday language
- **Contextual Responses**: Provides relevant information based on medical knowledge base
- **Graceful Fallbacks**: When specific information isn't available, offers safe general wellness guidance

### 🎭 **Human-Like Persona**
- **Empathetic Communication**: MediBot adopts a caring, supportive tone in all interactions
- **No Technical Jargon**: Avoids revealing its internal processes (like "according to the documents...")
- **Consistent Character**: Maintains its helpful health assistant persona throughout conversations

### 🔒 **Safety & Reliability**
- **Medical Disclaimers**: Every response concludes with appropriate safety warnings
- **Escalation Logic**: Identifies when users should seek immediate medical attention
- **Controlled Responses**: Limited to safe, general wellness advice when specific data is unavailable

### 🏗️ **Modern Infrastructure**
- **RESTful API**: Clean, well-documented FastAPI backend with automatic OpenAPI documentation
- **Vector Search**: Qdrant-powered semantic search for relevant medical information retrieval
- **Responsive Frontend**: Modern React application with intuitive user interface
- **Containerized Deployment**: Docker Compose setup for easy development and deployment

### 📊 **Observability & Monitoring**
- **Structured Logging**: Comprehensive logging using Loguru for debugging and monitoring
- **Request Tracking**: Monitor query processing times and system performance
- **Error Handling**: Robust error management with meaningful user feedback

---

## 🏗️ Architecture

MediBot follows a modern, microservices-inspired architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │   FastAPI API   │    │ Qdrant Vector   │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   Database      │
│   Port: 5173    │    │   Port: 8000    │    │   Port: 6333    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │              ┌─────────────────┐               │
         └──────────────►│   Google        │◄──────────────┘
                         │   Gemini AI     │
                         └─────────────────┘
```

### 🔄 **Request Flow**
1. **User Input**: User submits health query through React frontend
2. **API Processing**: FastAPI receives and validates the request
3. **Information Retrieval**: Qdrant vector database searches for relevant medical information
4. **AI Generation**: Google Gemini processes the context and generates human-like responses
5. **Safety Layer**: Response validation and mandatory disclaimer addition
6. **User Response**: Formatted response delivered to frontend

---

## 🛠️ Tech Stack

### **Backend**
- ![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=flat&logo=fastapi) **FastAPI** - High-performance Python web framework
- ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) **Python 3.11+** - Core programming language
- ![Pydantic](https://img.shields.io/badge/Pydantic-E92063?style=flat&logo=pydantic&logoColor=white) **Pydantic** - Data validation and settings management

### **AI & Machine Learning**
- ![Google](https://img.shields.io/badge/Google%20Gemini-4285F4?style=flat&logo=google&logoColor=white) **Google Gemini** - Advanced language model for natural responses
- ![LangChain](https://img.shields.io/badge/LangChain-121212?style=flat&logo=chainlink&logoColor=white) **LangChain** - Framework for building LLM applications
- ![Sentence Transformers](https://img.shields.io/badge/Sentence%20Transformers-FF6B6B?style=flat) **Sentence Transformers** - Text embedding models

### **Database & Storage**
- ![Qdrant](https://img.shields.io/badge/Qdrant-DC382D?style=flat) **Qdrant** - Vector database for semantic search
- ![FAISS](https://img.shields.io/badge/FAISS-0467DF?style=flat) **FAISS** - Legacy vector indexing (being phased out)

### **Frontend**
- ![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB) **React 18** - Modern JavaScript library for building user interfaces
- ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) **Vite** - Lightning-fast build tool
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) **Tailwind CSS** - Utility-first CSS framework

### **DevOps & Deployment**
- ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) **Docker & Docker Compose** - Containerization platform
- ![Loguru](https://img.shields.io/badge/Loguru-306998?style=flat) **Loguru** - Advanced Python logging

---

## 📂 Project Structure


```plaintext
AI-HEALTH-CHATBOT/
├── backend/                    # FastAPI Backend Application
│   ├── app/
│   │   ├── Medical_DataBase/   # Stores the FAISS vector index for the RAG model
│   │   │   ├── index.faiss
│   │   │   └── index.pkl
│   │   ├── models/             # Pydantic schemas for data validation (schemas.py)
│   │   ├── routers/            # Defines the API endpoints (e.g., /chat, /disease)
│   │   │   ├── chat.py
│   │   │   ├── disease.py
│   │   │   └── health.py
│   │   ├── services/           # Contains the core business logic for all features
│   │   │   ├── disease_predictor.py
│   │   │   ├── health_info.py
│   │   │   ├── medical_agent.py # Manages the core RAG pipeline and LLM interaction
│   │   │   └── symptom_checker.py
│   │   ├── utils/              # Utility and helper functions
│   │   ├── config.py           # Handles configuration and environment variables
│   │   └── main.py             # The main entry point to launch the FastAPI server
│   ├── data/                   # Directory for raw data files like CSVs
│   └── requirements.txt        # A list of all Python dependencies
│
├── client/                     # React Frontend Application
│   ├── public/                 # Contains static assets like the main index.html and icons
│   ├── src/
│   │   ├── api/                # Functions for making HTTP requests to the backend
│   │   ├── assets/             # Stores local assets like images, fonts, and CSS
│   │   ├── components/         # Reusable React components (e.g., ChatWindow, Button)
│   │   ├── pages/              # Components representing entire pages or views
│   │   ├── App.jsx             # The main root component of the application
│   │   └── main.jsx            # The entry point for the React application
│   ├── package.json            # Lists Node.js dependencies and project scripts
│   └── vite.config.js          # Configuration file for the Vite build tool
│
└── README.md                   # You are here!
```


# AI Health Chatbot

Medibot is a Streamlit-based AI health assistant that provides symptom checking, health guidance, and doctor recommendations using NLP and Retrieval-Augmented Generation (RAG).

---

## 🚀 New Feature: NLP Enhancement (Multilingual Support)

- Added translation pipeline (English ↔ Hindi, Marathi, Telugu).
- Integrated multilingual embeddings with FAISS.
- Added language selector in Streamlit UI.
- Ensured responses maintain medical safety disclaimer.

### How to Run:
1. `pip install -r requirements.txt`
2. `streamlit run app/WellnessResourceHub.py`

```
AI-health-chatbot/
├── 📁 backend/                          # Backend API and services
│   ├── 📁 app/
│   │   ├── 📁 config/                   # Configuration management
│   │   │   └── 📄 __init__.py
│   │   ├── 📁 models/                   # Pydantic models and schemas
│   │   │   └── 📄 schemas.py
│   │   ├── 📁 routers/                  # FastAPI route handlers
│   │   │   ├── 📄 chat.py              # Main chat endpoint
│   │   │   └── 📄 rag.py               # RAG pipeline endpoints
│   │   ├── 📁 services/                 # Business logic and AI services
│   │   │   ├── 📁 rag/                 # RAG implementation
│   │   │   │   ├── 📄 generation/      # AI response generation
│   │   │   │   ├── 📄 ingestion/       # Document processing
│   │   │   │   └── 📄 retrieval/       # Information retrieval
│   │   │   ├── 📄 medical_agent.py     # Main AI agent logic
│   │   │   └── 📄 symptom_checker.py   # Symptom analysis
│   │   └── 📄 main.py                  # FastAPI application entry point
│   ├── 📄 docker-compose.yml           # Docker services configuration
│   ├── 📄 Dockerfile                   # Backend container definition
│   ├── 📄 requirements.txt             # Python dependencies
│   └── 📄 .env.example                # Environment variables template
├── 📁 client/                          # React frontend application
│   ├── 📁 public/                      # Static assets
│   ├── 📁 src/
│   │   ├── 📁 api/                     # API communication layer
│   │   ├── 📁 components/              # Reusable React components
│   │   ├── 📁 pages/                   # Application pages
│   │   └── 📄 main.jsx                # React entry point
│   ├── 📄 package.json                # Node.js dependencies
│   └── 📄 vite.config.js              # Vite configuration
├── 📁 data/                           # Medical knowledge base
│   └── 📁 medical_knowledge/
│       └── 📄 medlineplus_structured.json
├── 📁 DoctorSpecialistRecommend/      # Doctor recommendation system
│   ├── 📄 Disease_Description.csv
│   ├── 📄 Doctor_Specialist.csv
│   └── 📄 doctor_spec.py
├── 📄 README.md                       # Project documentation
├── 📄 CONTRIBUTING.md                 # Contribution guidelines
├── 📄 CODE_OF_CONDUCT.md             # Community standards
├── 📄 LICENSE                        # MIT License
└── 📄 ROADMAP.md                     # Development roadmap
```

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- ![Docker](https://img.shields.io/badge/Docker-Required-2496ED?style=flat&logo=docker&logoColor=white) **[Docker Desktop](https://www.docker.com/get-started/)** - Essential for running the containerized backend
- ![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=flat&logo=node.js&logoColor=white) **Node.js 16+** - For frontend development
- ![Git](https://img.shields.io/badge/Git-Required-F05032?style=flat&logo=git&logoColor=white) **Git** - Version control system

### 🔧 Backend Setup

1. **Clone the Repository**
   ```
   git clone https://github.com/CharithaReddy18/AI-health-chatbot.git
   cd AI-health-chatbot
   ```

2. **Navigate to Backend Directory**
   ```
   cd backend
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the `backend` directory:
   ```
   cp .env.example .env
   ```
   
   Edit the `.env` file and add your API keys:
   ```
   # Required: Google AI API Key
   GOOGLE_API_KEY=your_google_gemini_api_key_here
   
   # Optional: Alternative LLM providers
   GROQ_API_KEY=your_groq_api_key_here
   
   # Database Configuration
   QDRANT_URL=http://qdrant:6333
   
   # Application Settings
   DEBUG=true
   ```

4. **Build and Start Services (First Time)**
   ```
   docker-compose up --build
   ```
   
   This command will:
   - Build the FastAPI application container
   - Download and start the Qdrant vector database
   - Install all Python dependencies
   - Initialize the medical knowledge base

5. **Verify Backend is Running**
   
   Once the containers are up, verify the services:
   - **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **API Health Check**: [http://localhost:8000/health](http://localhost:8000/health)
   - **Qdrant Dashboard**: [http://localhost:6333/dashboard](http://localhost:6333/dashboard)

### 🎨 Frontend Setup

1. **Navigate to Client Directory**
   ```
   cd client  # From the project root directory
   ```

2. **Install Dependencies**
   ```
   npm install
   ```

3. **Start Development Server**
   ```
   npm run dev
   ```

4. **Access the Application**
   
   Open your browser and navigate to [http://localhost:5173](http://localhost:5173)

### 🔄 Subsequent Runs

For future development sessions:

**Backend**: 
```
cd backend
docker-compose up  # No --build flag needed unless dependencies change
```


**Frontend**: 
```
cd client
npm run dev
```

> 💡 **Pro Tip**: If you modify `requirements.txt`, remember to rebuild with `docker-compose up --build`

---

## ⚙️ Configuration

### 🔐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GOOGLE_API_KEY` | Google Gemini API key for AI responses | ✅ Yes | None |
| `GROQ_API_KEY` | Alternative Groq API key | ❌ Optional | None |
| `QDRANT_URL` | Qdrant database connection URL | ❌ Optional | `http://qdrant:6333` |
| `DEBUG` | Enable debug logging | ❌ Optional | `false` |

### 🎛️ Application Settings

The application uses Pydantic for configuration management. Key settings include:

- **Embedding Model**: `sentence-transformers/all-MiniLM-L6-v2`
- **Vector Database**: Qdrant with 384-dimensional embeddings
- **LLM Temperature**: Low temperature (0.0-0.3) for consistent medical responses
- **Chunking Strategy**: 500 characters with 50-character overlap

---

## 🧪 Testing the System


```env
GROQ_API_KEY="YOUR_KEY_HERE"
HUGGINGFACE_API_KEY="YOUR_KEY_HERE"
```

### 🔍 **Basic Functionality Test**


1. **Start the Application** (both backend and frontend)

2. **Navigate to the Symptom Checker** in your browser

3. **Test Knowledge-Based Queries** (should use medical database):
   ```
   "What are the common causes of a headache?"
   "I have a sore throat and fever. What could this be?"
   "Can you explain what diabetes is?"
   ```

4. **Test Graceful Fallback Responses** (for topics not in database):
   ```
   "What's the best diet for weight loss?"
   "How can I improve my sleep quality?"
   "Can you suggest home remedies for stress?"
   ```

### 🏥 **Safety Feature Tests**

5. **Verify Safety Disclaimers**:
   - Ensure every response ends with medical disclaimer
   - Confirm bot never claims to be a real doctor

6. **Test Emergency Scenarios**:
   ```
   "I'm having severe chest pain and shortness of breath"
   "My child has a very high fever and is unresponsive"
   ```

### 📊 **API Testing**

7. **Direct API Testing**:
   - Visit [http://localhost:8000/docs](http://localhost:8000/docs)
   - Test the `POST /api/chat` endpoint
   - Example request body:
     ```
     {
       "query": "What are the symptoms of the flu?"
     }
     ```

### ✅ **Expected Behaviors**

- **Natural Responses**: Bot should never mention "context" or "documents"
- **Consistent Disclaimers**: Every response should include safety warnings
- **Appropriate Fallbacks**: Unknown topics should receive general wellness advice
- **Professional Tone**: Empathetic and helpful communication style

---

## 🔬 API Documentation

### 📡 **Main Endpoints**

#### `POST /api/chat`
Primary chat endpoint for health queries.

**Request Body:**
```
{
  "query": "string"  // User's health question
}
```

**Response:**
```
{
  "success": true,
  "query": "What are the symptoms of the flu?",
  "response": "The flu typically presents with...",
  "sources": ["medical_knowledge"],
  "processing_time": 1.23
}
```

#### `GET /health`
System health check endpoint.

**Response:**
```
{
  "status": "healthy",
  "services": {
    "api": "operational",
    "vector_db": "connected",
    "llm": "available"
  }
}
```

### 📋 **Request/Response Models**

- **MedicalQueryRequest**: Input validation for user queries
- **MedicalQueryResponse**: Structured response format
- **SystemStatusResponse**: Health check information

---

## 🎯 Features Roadmap

### 🔄 **Current Phase (v2.0)**
- ✅ Advanced RAG pipeline with Qdrant
- ✅ Google Gemini integration
- ✅ Human-like conversation prompts
- ✅ Docker containerization
- ✅ React frontend with modern UI

### 🚀 **Next Phase (v2.1)**
- 🔄 Enhanced medical knowledge base
- 🔄 Conversation memory and context
- 🔄 User authentication and history
- 🔄 Mobile-responsive design improvements

### 🌟 **Future Enhancements (v3.0+)**
- 🔮 Multi-language support (Hindi, Spanish, etc.)
- 🔮 Voice input and output capabilities
- 🔮 Integration with wearable devices
- 🔮 Telemedicine appointment booking
- 🔮 Advanced symptom tracking
- 🔮 Personalized health recommendations

### 🏥 **Long-term Vision**
- 🔮 Integration with Electronic Health Records (EHR)
- 🔮 Real-time vital signs monitoring
- 🔮 AI-powered health trend analysis
- 🔮 Collaboration with healthcare providers

---

## 🤝 Contributing

We welcome contributions from developers of all skill levels! MediBot is part of **GirlScript Summer of Code (GSSoC) 2025**, one of India's largest open-source programs.

### 🌟 **Ways to Contribute**

- 🐛 **Bug Fixes**: Help identify and resolve issues
- ✨ **New Features**: Implement exciting new functionality  
- 📚 **Documentation**: Improve guides and API docs
- 🎨 **UI/UX**: Enhance user experience and design
- 🔧 **Performance**: Optimize system efficiency
- 🔒 **Security**: Strengthen data protection
- 🧪 **Testing**: Expand test coverage

### 📋 **Getting Started**

1. **Fork the Repository**: Click the fork button on GitHub
2. **Create a Branch**: `git checkout -b feature/your-feature-name`
3. **Make Changes**: Implement your improvements
4. **Write Tests**: Ensure your changes work correctly
5. **Submit PR**: Create a pull request with clear description

### 📖 **Contribution Guidelines**

- Follow the [Contributing Guidelines](CONTRIBUTING.md)
- Adhere to the [Code of Conduct](CODE_OF_CONDUCT.md)
- Ensure medical accuracy and safety in health-related changes
- Include tests for new functionality
- Update documentation as needed

### 🏆 **Recognition**

Contributors will be:
- Listed in our Contributors section
- Eligible for GSSoC certificates and swag
- Recognized in release notes
- Invited to join our community discussions

---

## 🙏 Acknowledgments

### 🌟 **Special Thanks**

- **GirlScript Summer of Code (GSSoC) 2025** for providing an amazing platform for open-source collaboration
- **Google AI** for providing access to Gemini models
- **The Medical Community** for open medical datasets and knowledge sharing
- **Open Source Contributors** who make projects like this possible

### 🎓 **Educational Resources**

This project serves as an excellent learning resource for:
- Modern full-stack development with Python and React
- Implementing RAG (Retrieval-Augmented Generation) systems
- Working with vector databases and semantic search
- Building responsible AI applications for healthcare
- Docker containerization and microservices architecture

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

The MIT License allows for:
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use

---

## 👥 Contributors



->Thank you once again to all our contributors who has contributed to **AI-health-chatbot!** Your efforts are truly appreciated. 💖👏

### 🧑‍💼 **Project Admin**
<table>
<tr>
    <td align="center">
        <a href="https://github.com/CharithaReddy18">
            <img src="https://github.com/CharithaReddy18.png" width="100px;" alt="Charitha Reddy"/>
            <br />
            <sub><b>Nayini Charitha Reddy</b></sub>
        </a>
        <br />
        <sub>Project Maintainer</sub>
    </td>
</tr>
</table>


### 👨‍🏫 **Mentors (GSSoC '25)**
<table>
<tr>
    <td align="center">
        <a href="https://github.com/anshiagrawal22">
            <img src="https://github.com/anshiagrawal22.png" width="100px;" alt="Anshi Agarwal"/>
            <br />
            <sub><b>Anshi Agarwal</b></sub>
        </a>
        <br />
        <sub>Technical Mentor</sub>
    </td>
</tr>
</table>

### 🤝 **All Contributors**

Thanks to all the amazing people who have contributed to MediBot:

<a href="https://github.com/CharithaReddy18/AI-health-chatbot/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=CharithaReddy18/AI-health-chatbot" />
</a>

---

## 📊 Project Stats

<div align="center">

![GitHub Stars](https://img.shields.io/github/stars/CharithaReddy18/AI-health-chatbot?style=social)
![GitHub Forks](https://img.shields.io/github/forks/CharithaReddy18/AI-health-chatbot?style=social)
![GitHub Issues](https://img.shields.io/github/issues/CharithaReddy18/AI-health-chatbot)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/CharithaReddy18/AI-health-chatbot)
![GitHub Contributors](https://img.shields.io/github/contributors/CharithaReddy18/AI-health-chatbot)

</div>

---

## 🌟 Show Your Support

If you find MediBot helpful, please consider:

- ⭐ **Starring this repository**
- 🐦 **Sharing on social media**
- 💬 **Telling friends and colleagues**
- 🤝 **Contributing to the project**
- 📝 **Providing feedback and suggestions**

---

## 📞 Contact & Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/CharithaReddy18/AI-health-chatbot/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/CharithaReddy18/AI-health-chatbot/discussions)
- 📧 **Email**: Contact maintainers for collaboration opportunities
- 🔗 **LinkedIn**: Connect with the project team

---

<div align="center">

### 🚀 Ready to revolutionize healthcare with AI?

**[Get Started Now](#-quick-start)** | **[View Documentation](#-api-documentation)** | **[Join the Community](#-contributing)**

---

**Built with ❤️ by the MediBot team and the amazing open-source community**

*Making healthcare information accessible, one conversation at a time* 🏥✨

</div>

---

<div align="right">

**[⬆️ Back to Top](#-medibot-ai-health-assistant)**

</div>
