// client/src/components/SymptomCheckerComponents/ChatInput.jsx
import React, { useState, useRef, useEffect } from 'react';

const ChatInput = ({ onSendMessage, disabled = false }) => {
    const [text, setText] = useState('');
    const textareaRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim() && !disabled) {
            onSendMessage(text.trim());
            setText('');
            resetTextareaHeight();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const resetTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
    };

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const maxHeight = 120;
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [text]);

    return (
        <div className="relative">
            {/* Input Container */}
            <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 hover:border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-20 transition-all">
                <div className="flex items-end space-x-3 p-4">
                    {/* Textarea */}
                    <div className="flex-1 relative">
                        <textarea
                            ref={textareaRef}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={disabled ? "Please wait..." : "Ask about symptoms, conditions, or health concerns..."}
                            className="w-full bg-transparent text-gray-900 placeholder-gray-500 resize-none outline-none text-base leading-relaxed"
                            style={{
                                minHeight: '24px',
                                maxHeight: '120px'
                            }}
                            disabled={disabled}
                            rows={1}
                        />
                    </div>

                    {/* Send Button */}
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={!text.trim() || disabled}
                        className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all transform ${
                            !text.trim() || disabled
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-95'
                        }`}
                    >
                        {disabled ? (
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Footer */}
                <div className="px-4 pb-3 flex items-center justify-between text-xs text-gray-500">
                    <span>Press Enter to send • Shift + Enter for new line</span>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>AI powered</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;
