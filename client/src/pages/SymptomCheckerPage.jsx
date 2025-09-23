// client/src/pages/SymptomCheckerPage.js
import React, { useState, useEffect } from "react";
import ChatWindow from "../components/SymptomCheckerComponents/ChatWindow";
import ChatInput from "../components/SymptomCheckerComponents/ChatInput";
import { chatAPI } from "../api/ChatAPI";

const SymptomCheckerPage = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionInfo, setSessionInfo] = useState({ hasSession: false, sessionId: null });
  const [conversationStarted, setConversationStarted] = useState(false);

  useEffect(() => {
    initializeConversation();
  }, []);

  const initializeConversation = async () => {
    try {
      const currentSessionInfo = chatAPI.getSessionInfo();
      setSessionInfo(currentSessionInfo);

      if (currentSessionInfo.hasSession) {
        const isActive = await chatAPI.isSessionActive();
        
        if (isActive) {
          const history = await chatAPI.getConversationHistory();
          
          if (history && history.length > 0) {
            const formattedMessages = history.map((msg, index) => ({
              id: index + 1,
              text: msg.content,
              sender: msg.role === "user" ? "user" : "bot",
              timestamp: new Date(msg.timestamp),
              feedback: null,
              hasContext: msg.metadata?.hasContext || false,
              sources: msg.metadata?.sources || []
            }));
            
            setMessages(formattedMessages);
            setConversationStarted(true);
            console.log(`📚 Loaded ${history.length} messages from session ${currentSessionInfo.sessionId}`);
          }
        } else {
          chatAPI.resetSession();
          setSessionInfo({ hasSession: false, sessionId: null });
          showWelcomeMessage();
        }
      } else {
        showWelcomeMessage();
      }
    } catch (error) {
      console.error("Failed to initialize conversation:", error);
      showWelcomeMessage();
    }
  };

  const showWelcomeMessage = () => {
    const welcomeMessage = {
      id: Date.now(),
      text: "Hello! I'm MediBot, your AI Health Assistant. I can help you with health questions and provide medical information. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
      feedback: null,
      hasContext: false,
      sources: []
    };
    setMessages([welcomeMessage]);
    setConversationStarted(false);
  };

  const handleSendMessage = async (text) => {
    const newUserMessage = { 
      id: Date.now(), 
      text, 
      sender: "user",
      timestamp: new Date(),
      feedback: null 
    };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const result = await chatAPI.sendMessage(text);
      
      const newSessionInfo = chatAPI.getSessionInfo();
      if (newSessionInfo.sessionId !== sessionInfo.sessionId) {
        setSessionInfo(newSessionInfo);
        console.log(`🔄 Session updated: ${newSessionInfo.sessionId}`);
      }

      const botResponse = {
        id: Date.now() + 1,
        text: result.response,
        sender: "bot",
        timestamp: new Date(),
        feedback: null,
        hasContext: result.hasContext || false,
        sources: result.sources || [],
        generationTime: result.generation_time
      };

      setMessages((prev) => [...prev, botResponse]);
      setConversationStarted(true);

      if (result.hasContext) {
        console.log("🧠 Response used conversation context");
      }

    } catch (err) {
      console.error("Chat API error:", err);
      
      const errorResponse = {
        id: Date.now() + 1,
        text: "⚠️ Sorry, I couldn't process your request. Please try again.",
        sender: "bot",
        timestamp: new Date(),
        feedback: null,
        isError: true
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = async () => {
    try {
      setIsLoading(true);
      await chatAPI.startNewConversation();
      
      const newSessionInfo = chatAPI.getSessionInfo();
      setSessionInfo(newSessionInfo);
      setMessages([]);
      setConversationStarted(false);
      
      showWelcomeMessage();
      
      console.log("🆕 Started new conversation");
    } catch (error) {
      console.error("Failed to start new conversation:", error);
      setMessages([]);
      showWelcomeMessage();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConversation = async () => {
    try {
      setIsLoading(true);
      const success = await chatAPI.clearConversation();
      
      if (success) {
        setMessages([]);
        setConversationStarted(false);
        showWelcomeMessage();
        console.log("🧹 Conversation cleared");
      } else {
        console.warn("Failed to clear conversation on server");
      }
    } catch (error) {
      console.error("Failed to clear conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (messageId, feedbackType) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, feedback: feedbackType } : msg
      )
    );
    
    console.log(`📝 Feedback for message ${messageId}: ${feedbackType}`);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">
            {sessionInfo.hasSession 
              ? (conversationStarted ? 'Conversation Active' : 'Ready to Chat')
              : 'Starting Session...'
            }
          </span>
          {sessionInfo.sessionId && (
            <span className="text-xs text-gray-500">
              #{sessionInfo.sessionId.slice(-8)}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {conversationStarted && (
            <button
              onClick={handleClearConversation}
              disabled={isLoading}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Clear Chat
            </button>
          )}
          <button
            onClick={handleNewConversation}
            disabled={isLoading}
            className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            New Chat
          </button>
        </div>
      </div>

      {/* Chat Container - Full Height */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Chat Window - Scrollable */}
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onFeedback={handleFeedback}
          sessionInfo={sessionInfo}
        />

        {/* Chat Input - Fixed at Bottom */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              disabled={isLoading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomCheckerPage;
