// client/src/api/ChatAPI.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // FastAPI backend
});

class ChatAPIWithMemory {
  constructor() {
    // Get existing session from localStorage
    this.sessionId = localStorage.getItem('medibot_session_id') || null;
    this.sessionActive = false;
  }

  /**
   * Send message with automatic session management
   */
  async sendMessage(message) {
    try {
      const response = await API.post("/api/rag/chat", {
        query: message,
        session_id: this.sessionId // Will auto-create if null
      });

      const data = response.data;

      // Store session ID for future use
      if (data.session_id && data.session_id !== this.sessionId) {
        this.sessionId = data.session_id;
        localStorage.setItem('medibot_session_id', this.sessionId);
        this.sessionActive = true;
      }

      return {
        ...data,
        // Transform to match your existing Message component expectations
        response: data.response,
        hasContext: data.conversation_context_used,
        sources: data.sources || [],
        sessionId: data.session_id
      };

    } catch (error) {
      console.error("Chat API error:", error);
      
      // Return error in expected format
      return {
        success: false,
        response: "⚠️ Sorry, I couldn't process your request. Please try again.",
        hasContext: false,
        sources: [],
        sessionId: this.sessionId,
        error: error.message
      };
    }
  }

  /**
   * Create a new conversation session
   */
  async startNewConversation() {
    try {
      const response = await API.post("/api/rag/session/new");
      const data = response.data;
      
      this.sessionId = data.session_id;
      localStorage.setItem('medibot_session_id', this.sessionId);
      this.sessionActive = true;
      
      console.log(`🆕 Started new conversation: ${this.sessionId}`);
      return data;
      
    } catch (error) {
      console.error("Failed to create new session:", error);
      throw error;
    }
  }

  /**
   * Clear current conversation history
   */
  async clearConversation() {
    if (!this.sessionId) return;
    
    try {
      await API.post(`/api/rag/session/${this.sessionId}/clear`);
      console.log(`🧹 Cleared conversation: ${this.sessionId}`);
      return true;
    } catch (error) {
      console.error("Failed to clear conversation:", error);
      return false;
    }
  }

  /**
   * Get conversation history
   */
  async getConversationHistory() {
    if (!this.sessionId) return [];
    
    try {
      const response = await API.get(`/api/rag/session/${this.sessionId}/history`);
      return response.data.messages;
    } catch (error) {
      console.error("Failed to get conversation history:", error);
      return [];
    }
  }

  /**
   * Check if session is active
   */
  async isSessionActive() {
    if (!this.sessionId) return false;
    
    try {
      const response = await API.get(`/api/rag/session/${this.sessionId}/status`);
      return response.data.exists;
    } catch (error) {
      console.error("Failed to check session status:", error);
      return false;
    }
  }

  /**
   * Get current session ID
   */
  getCurrentSessionId() {
    return this.sessionId;
  }

  /**
   * Reset session (logout/new user)
   */
  resetSession() {
    this.sessionId = null;
    this.sessionActive = false;
    localStorage.removeItem('medibot_session_id');
    console.log("🔄 Session reset");
  }

  /**
   * Get session info for UI display
   */
  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      isActive: this.sessionActive,
      hasSession: !!this.sessionId
    };
  }
}

// Create singleton instance
export const chatAPI = new ChatAPIWithMemory();

// BACKWARD COMPATIBILITY: Keep existing function for components that use it
export const sendMessage = async (message) => {
  return await chatAPI.sendMessage(message);
};

// Legacy function for disease prediction (unchanged)
export const predictDisease = async (symptoms, threshold = 20) => {
  const response = await API.post("/api/predict", {
    symptoms,
    threshold,
  });
  return response.data;
};

export default chatAPI;
