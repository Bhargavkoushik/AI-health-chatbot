// client/src/components/SymptomCheckerComponents/ChatWindow.jsx
import React, { useEffect, useRef, useState } from 'react';
import Message from './Message';
import MedicalDisclaimer from './MedicalDisclaimer';
import TypingIndicator from '../UI/TypingIndicator';

const ChatWindow = ({ messages, isLoading, onFeedback, sessionInfo }) => {
    const messagesEndRef = useRef(null);
    const containerRef = useRef(null);
    const [showDisclaimer, setShowDisclaimer] = useState(true);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // useEffect(() => {
    //     scrollToBottom();
    // }, [messages, isLoading]);

    // Download entire conversation
    const downloadConversation = () => {
        const conversationData = {
            session_id: sessionInfo.sessionId,
            timestamp: new Date().toISOString(),
            messages: messages.map(msg => ({
                id: msg.id,
                sender: msg.sender,
                content: msg.text,
                timestamp: msg.timestamp,
                hasContext: msg.hasContext,
                sources: msg.sources || [],
                metadata: msg.metadata || {}
            }))
        };
        
        const blob = new Blob([JSON.stringify(conversationData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `medibot-conversation-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div 
            ref={containerRef}
            className="flex-1 overflow-y-auto bg-gray-50"
        >
            {/* Medical Disclaimer - Shows once */}
            {showDisclaimer && messages.length > 0 && (
                <MedicalDisclaimer />
            )}

            <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
                {/* Empty State */}
                {messages.length === 0 && !isLoading && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                            <span className="text-2xl sm:text-3xl">🏥</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                            Hi! I'm MediBot
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-md leading-relaxed text-sm sm:text-base">
                            I'm here to help with your health questions. I can provide information about symptoms, conditions, and general health guidance.
                        </p>
                        
                        {/* Conversation Download Option */}
                        {sessionInfo.hasSession && (
                            <button
                                onClick={downloadConversation}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Download Conversation</span>
                            </button>
                        )}
                    </div>
                )}

                {/* Messages */}
                <div className="space-y-3 sm:space-y-4">
                    {messages.map((msg, index) => (
                        <Message 
                            key={msg.id}
                            message={msg} 
                            onFeedback={onFeedback}
                            showContextIndicator={index > 0}
                        />
                    ))}
                    
                    {/* Typing Indicator */}
                    {isLoading && (
                        <div className="flex justify-start px-3">
                            <div className="flex items-start space-x-2 sm:space-x-3">
                                <div className="w-7 h-7 sm:w-9 sm:h-9 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-sm">
                                    <span className="text-white text-xs sm:text-sm font-medium">🏥</span>
                                </div>
                                <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 sm:px-4 sm:py-3 shadow-sm border border-gray-200 max-w-xs">
                                    <TypingIndicator />
                                    <div className="text-xs text-gray-500 mt-2">
                                        {sessionInfo.hasSession ? "Considering our conversation..." : "Analyzing your question..."}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;
