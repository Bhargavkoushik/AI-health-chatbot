// client/src/components/SymptomCheckerComponents/ConversationControls.jsx
import React from 'react';

const ConversationControls = ({ 
  sessionInfo, 
  conversationStarted, 
  onNewConversation, 
  onClearConversation, 
  isLoading 
}) => {
  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex justify-between items-center">
      {/* Session Info */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${sessionInfo.hasSession ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
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
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {/* Clear Conversation */}
        {conversationStarted && (
          <button
            onClick={onClearConversation}
            disabled={isLoading}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Clear current conversation history"
          >
            Clear History
          </button>
        )}

        {/* New Conversation */}
        <button
          onClick={onNewConversation}
          disabled={isLoading}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Start a new conversation"
        >
          New Chat
        </button>
      </div>
    </div>
  );
};

export default ConversationControls;
