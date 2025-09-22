"""
AI Health Chatbot - Backend Application with Input Validation
Flask backend that integrates with your existing medical_agent.py
"""

import re
import html
import logging
import os
import json
import uuid
from datetime import datetime
from typing import Dict, List, Tuple, Optional, Any
import traceback
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

# Configure logging
if not os.path.exists('logs'):
    os.makedirs('logs')

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f'logs/health_chatbot_{datetime.now().strftime("%Y%m%d")}.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Import your existing modules
try:
    from medical_agent import process_health_query  # Adjust import based on your actual function
    MEDICAL_AGENT_AVAILABLE = True
    logger.info("Successfully imported medical_agent module")
except ImportError as e:
    logger.warning(f"Could not import medical_agent: {e}")
    MEDICAL_AGENT_AVAILABLE = False

try:
    from DoctorSpecialistRecommend.doctor_spec import get_specialist_recommendation
    SPECIALIST_RECOMMENDER_AVAILABLE = True
    logger.info("Successfully imported doctor specialist module")
except ImportError as e:
    logger.warning(f"Could not import doctor specialist module: {e}")
    SPECIALIST_RECOMMENDER_AVAILABLE = False

class InputValidator:
    """Comprehensive input validation for health queries"""
    
    def __init__(self):
        self.config = {
            'min_length': 3,
            'max_length': 500,
            'max_special_char_ratio': 0.3,
            'min_words': 1,
            'max_words': 100
        }
        
        # Medical terms for health relevance detection
        self.medical_terms = {
            'pain', 'ache', 'hurt', 'sore', 'fever', 'headache', 'nausea', 'dizzy',
            'fatigue', 'tired', 'weak', 'cough', 'cold', 'flu', 'infection', 'allergy',
            'symptoms', 'symptom', 'feel', 'feeling', 'sick', 'ill', 'disease',
            'condition', 'diagnosis', 'treatment', 'medicine', 'medication', 'drug',
            'doctor', 'physician', 'hospital', 'clinic', 'medical', 'health',
            'chest', 'stomach', 'back', 'head', 'throat', 'ear', 'eye', 'skin'
        }
        
        # Emergency keywords
        self.urgency_keywords = {
            'emergency', 'urgent', 'severe', 'intense', 'extreme', 'unbearable',
            'sudden', 'acute', 'critical', 'can\'t breathe', 'chest pain', 'heart attack'
        }
        
        # Security patterns to block
        self.malicious_patterns = [
            r'<script.*?>.*?</script>', r'javascript:', r'on\w+\s*=',
            r'<iframe.*?>', r'<object.*?>', r'<embed.*?>',
            r'eval\s*\(', r'document\.', r'window\.', r'\.innerHTML'
        ]
        
        # Allowed characters (alphanumeric + basic punctuation)
        self.allowed_pattern = re.compile(r'^[a-zA-Z0-9\s.,!?;:()\-\'"]+$')
    
    def validate_input(self, user_input: str) -> Dict[str, Any]:
        """Validate user input with comprehensive checks"""
        result = {
            'is_valid': False,
            'cleaned_input': '',
            'error_message': '',
            'warning_message': '',
            'is_health_related': False,
            'has_urgency': False,
            'confidence_score': 0.0
        }
        
        try:
            # Basic checks
            if not user_input or not isinstance(user_input, str):
                result['error_message'] = "Please provide a valid text input."
                return result
            
            # Clean input
            cleaned_input = str(user_input).strip()
            cleaned_input = html.escape(cleaned_input)
            cleaned_input = re.sub(r'\s+', ' ', cleaned_input)
            
            # Empty/whitespace check
            if not cleaned_input or cleaned_input.isspace():
                result['error_message'] = "Input cannot be empty or contain only whitespace."
                return result
            
            # Length validation
            char_count = len(cleaned_input)
            if char_count < self.config['min_length']:
                result['error_message'] = f"Input too short. Please provide at least {self.config['min_length']} characters."
                return result
            
            if char_count > self.config['max_length']:
                result['error_message'] = f"Input too long. Please limit to {self.config['max_length']} characters."
                return result
            
            # Word count validation
            words = cleaned_input.split()
            word_count = len(words)
            if word_count < self.config['min_words']:
                result['error_message'] = "Please provide a more detailed query."
                return result
            
            if word_count > self.config['max_words']:
                result['error_message'] = "Query too long. Please be more concise."
                return result
            
            # Security check
            for pattern in self.malicious_patterns:
                if re.search(pattern, cleaned_input, re.IGNORECASE):
                    result['error_message'] = "Input contains potentially harmful content. Please rephrase your query."
                    return result
            
            # Character pattern validation (alphanumeric + basic punctuation only)
            if not self.allowed_pattern.match(cleaned_input):
                result['error_message'] = "Input contains invalid characters. Please use only letters, numbers, and basic punctuation."
                return result
            
            # Special character ratio check
            special_chars = len(re.findall(r'[^a-zA-Z0-9\s.,!?;:()\-\'\""]', cleaned_input))
            special_char_ratio = special_chars / len(cleaned_input) if cleaned_input else 0
            if special_char_ratio > self.config['max_special_char_ratio']:
                result['error_message'] = "Too many special characters. Please use standard text."
                return result
            
            # Health relevance check
            text_lower = cleaned_input.lower()
            is_health_related = any(term in text_lower for term in self.medical_terms)
            has_urgency = any(keyword in text_lower for keyword in self.urgency_keywords)
            
            # Confidence score calculation
            confidence_score = 0.0
            if len(words) >= 3:
                confidence_score += 0.2
            medical_term_count = sum(1 for term in self.medical_terms if term in text_lower)
            confidence_score += min(medical_term_count * 0.15, 0.5)
            if re.search(r'\?', cleaned_input):
                confidence_score += 0.1
            confidence_score = min(confidence_score, 1.0)
            
            # Success result
            result.update({
                'is_valid': True,
                'cleaned_input': cleaned_input,
                'is_health_related': is_health_related,
                'has_urgency': has_urgency,
                'confidence_score': confidence_score
            })
            
            # Warnings
            warnings = []
            if not is_health_related:
                warnings.append("This doesn't appear to be health-related. I work best with medical questions.")
            if has_urgency:
                warnings.append("⚠️ For urgent medical concerns, please contact emergency services immediately!")
            if confidence_score < 0.4:
                warnings.append("Your query might be unclear. Consider adding more details.")
            
            if warnings:
                result['warning_message'] = " | ".join(warnings)
            
            logger.info(f"Input validation successful: {cleaned_input[:50]}...")
            
        except Exception as e:
            logger.error(f"Validation error: {str(e)}")
            result['error_message'] = "An error occurred while processing your input."
        
        return result

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize validator
validator = InputValidator()
chat_history = {}

@app.route('/', methods=['GET'])
def index():
    """Serve your HTML frontend"""
    return render_template('index.html')

@app.route('/api/health/query', methods=['POST'])
def handle_health_query():
    """Main API endpoint to handle health queries with validation"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'error': 'No data provided'}), 400
        
        user_input = data.get('query', '').strip()
        session_id = data.get('session_id', str(uuid.uuid4())[:8])
        
        if not user_input:
            return jsonify({'success': False, 'error': 'Query cannot be empty'}), 400
        
        # Validate input
        validation_result = validator.validate_input(user_input)
        
        if not validation_result['is_valid']:
            return jsonify({
                'success': False,
                'error': validation_result['error_message']
            }), 400
        
        cleaned_input = validation_result['cleaned_input']
        
        # Get AI response
        try:
            if MEDICAL_AGENT_AVAILABLE:
                ai_response = process_health_query(cleaned_input)
            else:
                ai_response = f"Thank you for your health query: '{cleaned_input}'. I recommend consulting with a healthcare professional for personalized advice."
        except Exception as e:
            logger.error(f"Medical agent error: {e}")
            ai_response = "I encountered an error processing your query. Please try rephrasing your question."
        
        # Get specialist recommendations
        specialists = []
        if SPECIALIST_RECOMMENDER_AVAILABLE and validation_result['is_health_related']:
            try:
                specialists = get_specialist_recommendation(cleaned_input)
            except Exception as e:
                logger.error(f"Specialist recommendation error: {e}")
        
        # Log interaction
        if session_id not in chat_history:
            chat_history[session_id] = []
        
        chat_history[session_id].append({
            'timestamp': datetime.now().isoformat(),
            'query': cleaned_input[:100],
            'response_length': len(ai_response),
            'confidence': validation_result['confidence_score'],
            'is_health_related': validation_result['is_health_related']
        })
        
        # Keep only last 10 interactions per session
        if len(chat_history[session_id]) > 10:
            chat_history[session_id] = chat_history[session_id][-10:]
        
        response = {
            'success': True,
            'message': 'Query processed successfully',
            'data': {
                'ai_response': ai_response,
                'confidence': validation_result['confidence_score'],
                'is_health_related': validation_result['is_health_related'],
                'has_urgency': validation_result['has_urgency'],
                'specialist_recommendations': specialists if specialists else []
            }
        }
        
        if validation_result['warning_message']:
            response['warning'] = validation_result['warning_message']
        
        logger.info(f"Query processed successfully for session {session_id}")
        return jsonify(response), 200
        
    except Exception as e:
        logger.error(f"API error: {str(e)}")
        return jsonify({'success': False, 'error': 'Internal server error'}), 500

@app.route('/api/health/validate', methods=['POST'])
def validate_input_only():
    """API endpoint for real-time input validation"""
    try:
        data = request.get_json()
        user_input = data.get('query', '').strip()
        
        if not user_input:
            return jsonify({
                'is_valid': False,
                'error_message': 'Query cannot be empty'
            }), 400
        
        validation_result = validator.validate_input(user_input)
        return jsonify(validation_result), 200
        
    except Exception as e:
        logger.error(f"Validation endpoint error: {e}")
        return jsonify({
            'is_valid': False,
            'error_message': 'Validation error occurred'
        }), 500

@app.route('/api/health/history/<session_id>', methods=['GET'])
def get_chat_history(session_id):
    """Get chat history for a session"""
    try:
        history = chat_history.get(session_id, [])
        return jsonify({
            'success': True,
            'history': history
        }), 200
    except Exception as e:
        logger.error(f"History retrieval error: {e}")
        return jsonify({
            'success': False,
            'error': 'Error retrieving chat history'
        }), 500

@app.route('/api/health/stats', methods=['GET'])
def get_system_stats():
    """Get system statistics"""
    try:
        total_sessions = len(chat_history)
        total_queries = sum(len(history) for history in chat_history.values())
        
        return jsonify({
            'success': True,
            'stats': {
                'total_sessions': total_sessions,
                'total_queries': total_queries,
                'medical_agent_available': MEDICAL_AGENT_AVAILABLE,
                'specialist_recommender_available': SPECIALIST_RECOMMENDER_AVAILABLE,
                'system_status': 'healthy'
            }
        }), 200
    except Exception as e:
        logger.error(f"Stats error: {e}")
        return jsonify({
            'success': False,
            'error': 'Error retrieving system stats'
        }), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'success': False, 'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {error}")
    return jsonify({'success': False, 'error': 'Internal server error'}), 500

if __name__ == '__main__':
    logger.info("Starting AI Health Chatbot Backend...")
    logger.info(f"Medical Agent Available: {MEDICAL_AGENT_AVAILABLE}")
    logger.info(f"Specialist Recommender Available: {SPECIALIST_RECOMMENDER_AVAILABLE}")
    app.run(debug=True, host='0.0.0.0', port=5000)