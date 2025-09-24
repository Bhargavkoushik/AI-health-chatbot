# 🎨 MediBot Frontend - React Client Application

> **Modern React frontend for MediBot AI Health Assistant with real-time chat interface and comprehensive health tools.**

## 📱 Overview

The MediBot frontend is a React 19.1.1 application built with Vite and Tailwind CSS. It provides an intuitive user interface for interacting with the AI health assistant, featuring a real-time chat interface, conversation memory, and multiple health-related tools.

## ✨ Implemented Features

### 💬 **Interactive Chat Interface**
- **Real-time messaging** with typing indicators and loading states
- **Session persistence** with automatic conversation history
- **Message feedback system** (thumbs up/down for responses)
- **New conversation** and clear conversation functionality
- **Context awareness indicators** showing when AI uses conversation history

### 🧭 **Multi-Page Navigation**
- **Landing Page** - Hero section with features and call-to-action
- **Symptom Checker** - Main chat interface for health queries
- **Wellness Hub** - Health calculators (BMI, calorie needs, heart rate zones, body fat percentage)
- **Clinical Trial Finder** - Interactive map-based trial discovery interface
- **Human Body Explorer** - Educational body systems exploration
- **Air Quality Forecaster** - Real-time AQI, pollen, and UV dashboard
- **Project Roadmap** - Visual development timeline
- **Tech Stack** - Technology showcase page
- **Contribute** - Contribution guidelines
- **Doctor Recommender** - Doctor recommendation interface
- **404 Page** - Custom not found page

### 🎨 **Modern UI/UX**
- **Responsive design** optimized for all device sizes
- **Smooth animations** using Framer Motion
- **Dark/light themed components** with consistent styling
- **Professional typography** and spacing
- **Interactive elements** with hover states and transitions

## 🛠️ Tech Stack

### **Core Framework**
- **React 19.1.1** - Latest React with concurrent features
- **Vite 7.1.2** - Lightning-fast build tool and dev server
- **React Router DOM 7.8.1** - Client-side routing

### **Styling & UI**
- **Tailwind CSS 4.1.12** - Utility-first CSS framework with latest features
- **Framer Motion 12.23.12** - Production-ready motion library
- **Lucide React 0.540.0** - Beautiful icon library
- **Typewriter Effect 2.22.0** - Animated text effects

### **Data & Communication**
- **Axios 1.11.0** - HTTP client for API requests
- **React Markdown 10.1.0** - Markdown rendering for chat messages
- **Remark GFM 4.0.1** - GitHub Flavored Markdown support

### **Development Tools**
- **ESLint 9.33.0** - Code linting and quality
- **Vite Plugin React 5.0.0** - React integration for Vite

## 📂 Project Structure

```
client/
└── 📁 src/
    ├── 📄 App.css
    ├── 📄 App.jsx
    ├── 📄 index.css
    ├── 📄 main.jsx
    ├── 📁 api/
    │   └── 📄 ChatAPI.js
    ├── 📁 assets/
    │   └── 📄 react.svg
    ├── 📁 components/
    │   ├── 📄 ChatInput.jsx
    │   ├── 📁 LandingPageComponents/
    │   │   ├── 📄 CTA.jsx
    │   │   ├── 📄 Disclaimer.jsx
    │   │   ├── 📄 Features.jsx
    │   │   └── 📄 Hero.jsx
    │   ├── 📁 Layout/
    │   │   ├── 📄 Footer.jsx
    │   │   ├── 📄 MainLayout.jsx
    │   │   └── 📄 Navbar.jsx
    │   ├── 📁 SymptomCheckerComponents/
    │   │   ├── 📄 ChatInput.jsx
    │   │   ├── 📄 ChatWindow.jsx
    │   │   ├── 📄 ConversationControls.jsx
    │   │   ├── 📄 MedicalDisclaimer.jsx
    │   │   └── 📄 Message.jsx
    │   └── 📁 UI/
    │       └── 📄 TypingIndicator.jsx
    └── 📁 pages/
        ├── 📄 AirQualityForecaster.jsx
        ├── 📄 ClinicalTrialFinder.jsx
        ├── 📄 Contribute.jsx
        ├── 📄 DoctorRecommender.jsx
        ├── 📄 FOLDER STERUCTURE.ini
        ├── 📄 HumanBodyExplorer.jsx
        ├── 📄 Landing.jsx
        ├── 📄 NotFoundPage.jsx
        ├── 📄 RoadMap.jsx
        ├── 📄 SymptomCheckerPage.jsx
        ├── 📄 TechStack.jsx
        └── 📄 WellnessHub.jsx
├── 📁 public/
│   ├── 📄 gssoc logo.png
│   ├── 📄 shield.svg
│   └── 📄 vite.svg
├── 📄 vite.config.js
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 index.html
├── 📄 eslint.config.js
├── 📄 README.md
└── 📄 .gitignore

```

## 🔌 Backend Integration

The frontend communicates with a **FastAPI backend** running on `http://localhost:8000` through a clean API layer:

### **API Communication (`ChatAPI.js`)**
- **Session Management**: Automatic session creation and persistence using localStorage
- **Real-time Chat**: POST requests to `/api/rag/chat` endpoint
- **Conversation History**: GET requests to retrieve previous messages
- **Session Control**: Create new conversations and clear existing ones

### **Key API Interactions**
```javascript
// Send message with session management
await chatAPI.sendMessage(message)

// Get conversation history
await chatAPI.getConversationHistory()

// Start new conversation
await chatAPI.startNewConversation()

// Clear current conversation
await chatAPI.clearConversation()
```

### **Backend Response Handling**
The frontend processes responses that include:
- **AI-generated responses** from Google Gemini
- **Conversation context indicators** showing when previous messages were used
- **Source citations** from the medical knowledge base
- **Session IDs** for conversation persistence
- **Generation timing** and metadata

## 🚀 Getting Started

### Prerequisites
- **Node.js 16+** - JavaScript runtime
- **npm or yarn** - Package manager

### Installation & Setup

1. **Navigate to Client Directory**
   ```bash
   cd client
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   Open http://localhost:5173 in your browser

### **Backend Requirement**
The frontend requires the FastAPI backend to be running on `http://localhost:8000` for full functionality. See the main project README for backend setup instructions.

## 🧪 Available Scripts

- **`npm run dev`** - Start development server with hot reload
- **`npm run build`** - Build production-ready application
- **`npm run preview`** - Preview production build locally
- **`npm run lint`** - Run ESLint for code quality checks

## 🎯 Key Components

### **SymptomCheckerPage.jsx**
- **Main chat interface** with conversation state management
- **Session persistence** and history loading
- **Real-time messaging** with loading states
- **Feedback system** for user ratings
- **Context awareness** indicators

### **ChatAPI.js**
- **Singleton API class** for consistent session management
- **Automatic session creation** and localStorage persistence
- **Error handling** with graceful fallbacks
- **Response transformation** for UI compatibility

### **Landing.jsx**
- **Hero section** with animated elements
- **Feature showcase** highlighting AI capabilities
- **Call-to-action** directing users to symptom checker
- **Medical disclaimer** for safety

## 🎨 Styling Architecture

### **Tailwind CSS Setup**
- **Custom configuration** with extended color palette
- **Responsive design utilities** for mobile-first development
- **Component-based styling** with reusable classes
- **Dark mode support** where applicable

### **Animation Strategy**
- **Framer Motion** for smooth page transitions
- **Loading states** for better user experience
- **Interactive elements** with hover and focus states
- **Typewriter effects** for engaging text display

## 🔒 State Management

### **Local State (React useState)**
- **Chat messages** array with message history
- **Loading states** for API requests
- **Session information** and user preferences
- **Form inputs** and user interactions

### **Session Persistence**
- **localStorage** for session ID storage
- **Conversation history** retrieved from backend
- **User preferences** maintained across sessions

## 📱 Responsive Design

- **Mobile-first approach** with Tailwind CSS
- **Breakpoint optimization** for tablets and desktops
- **Touch-friendly interfaces** for mobile devices
- **Flexible layouts** that adapt to screen sizes

## 🚀 Production Build

### Build Optimization
- **Code splitting** with Vite's automatic optimization
- **Asset optimization** including image compression
- **Bundle analysis** for performance monitoring
- **Progressive loading** for better user experience

### Deployment Ready
- **Static file generation** for easy hosting
- **Environment variable support** for different environments
- **CDN compatibility** for global distribution

## 🤝 Contributing to Frontend

### Development Guidelines
- **Component structure** - Keep components focused and reusable
- **Styling consistency** - Follow Tailwind CSS patterns
- **State management** - Use appropriate state management for component scope
- **API integration** - Use the existing ChatAPI.js for backend communication

### Code Quality
- **ESLint configuration** enforces coding standards
- **Component documentation** with clear prop definitions
- **Responsive design** testing across devices
- **Accessibility** considerations for inclusive design

---

**Frontend built with ❤️ using modern React ecosystem**

*Providing an intuitive interface for AI-powered health assistance* 🎨✨