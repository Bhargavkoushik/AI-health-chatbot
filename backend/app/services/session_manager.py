import uuid
import json
import os
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from pathlib import Path
import asyncio

from app.services.rag.utils.logging_config import rag_logger

@dataclass
class ChatMessage:
    """Individual chat message in conversation"""
    role: str  # 'user' or 'assistant'
    content: str
    timestamp: datetime
    metadata: Optional[Dict[str, Any]] = None
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "role": self.role,
            "content": self.content,
            "timestamp": self.timestamp.isoformat(),
            "metadata": self.metadata or {}
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'ChatMessage':
        return cls(
            role=data["role"],
            content=data["content"],
            timestamp=datetime.fromisoformat(data["timestamp"]),
            metadata=data.get("metadata", {})
        )

@dataclass
class ConversationSession:
    """Complete conversation session with memory"""
    session_id: str
    messages: List[ChatMessage]
    created_at: datetime
    updated_at: datetime
    metadata: Dict[str, Any]
    
    def add_message(self, role: str, content: str, metadata: Optional[Dict] = None):
        """Add new message to conversation"""
        message = ChatMessage(
            role=role,
            content=content,
            timestamp=datetime.now(),
            metadata=metadata
        )
        self.messages.append(message)
        self.updated_at = datetime.now()
        
    def get_recent_context(self, max_messages: int = 6) -> List[ChatMessage]:
        """Get recent conversation for context"""
        return self.messages[-max_messages:] if self.messages else []
    
    def get_conversation_summary(self, max_chars: int = 800) -> str:
        """Generate conversation summary for LLM context"""
        if not self.messages:
            return ""
            
        recent_messages = self.get_recent_context(max_messages=6)
        context_parts = []
        
        for msg in recent_messages:
            if msg.role == "user":
                context_parts.append(f"User: {msg.content}")
            else:
                # Truncate long responses for context
                content = msg.content[:200] + "..." if len(msg.content) > 200 else msg.content
                # Remove disclaimers from context to save space
                content = content.split("---")[0].strip()
                context_parts.append(f"Assistant: {content}")
        
        summary = "\n".join(context_parts)
        return summary[:max_chars] + "..." if len(summary) > max_chars else summary
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            "session_id": self.session_id,
            "messages": [msg.to_dict() for msg in self.messages],
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "metadata": self.metadata
        }

class SessionManager:
    """Production-ready session management with file storage"""
    
    def __init__(self, 
                 storage_path: str = "data/sessions", 
                 max_session_age_hours: int = 24,
                 max_sessions_per_cleanup: int = 100):
        self.storage_path = Path(storage_path)
        self.storage_path.mkdir(parents=True, exist_ok=True)
        self.max_session_age = timedelta(hours=max_session_age_hours)
        self.max_cleanup_sessions = max_sessions_per_cleanup
        self._active_sessions: Dict[str, ConversationSession] = {}
        self._last_cleanup = datetime.now()
        
        # Load recent sessions on startup
        self._load_recent_sessions()
        rag_logger.info(f"✅ SessionManager initialized with {len(self._active_sessions)} active sessions")
    
    def create_session(self) -> str:
        """Create new conversation session"""
        session_id = str(uuid.uuid4())
        now = datetime.now()
        
        session = ConversationSession(
            session_id=session_id,
            messages=[],
            created_at=now,
            updated_at=now,
            metadata={"version": "1.0", "source": "medibot"}
        )
        
        self._active_sessions[session_id] = session
        self._save_session_async(session)
        
        rag_logger.info(f"🆕 Created session: {session_id[:8]}...")
        return session_id
    
    def get_session(self, session_id: str) -> Optional[ConversationSession]:
        """Get existing session with auto-cleanup"""
        # Check active sessions first
        if session_id in self._active_sessions:
            session = self._active_sessions[session_id]
            
            # Check if expired
            if datetime.now() - session.updated_at > self.max_session_age:
                self._expire_session(session_id)
                return None
                
            return session
        
        # Try loading from disk
        session = self._load_session(session_id)
        if session:
            # Check if expired
            if datetime.now() - session.updated_at > self.max_session_age:
                self._expire_session(session_id)
                return None
                
            self._active_sessions[session_id] = session
            return session
        
        return None
    
    def add_message(self, session_id: str, role: str, content: str, metadata: Optional[Dict] = None) -> bool:
        """Add message to session"""
        session = self.get_session(session_id)
        if not session:
            # Auto-create session if it doesn't exist
            self.create_session()
            session = self.get_session(session_id)
            if not session:
                return False
            
        session.add_message(role, content, metadata)
        self._save_session_async(session)
        
        # Periodic cleanup
        self._maybe_cleanup()
        return True
    
    def get_conversation_context(self, session_id: str, max_messages: int = 6) -> str:
        """Get conversation context for LLM"""
        session = self.get_session(session_id)
        if not session:
            return ""
            
        return session.get_conversation_summary()
    
    def clear_session(self, session_id: str) -> bool:
        """Clear conversation history but keep session"""
        session = self.get_session(session_id)
        if not session:
            return False
            
        session.messages.clear()
        session.updated_at = datetime.now()
        self._save_session_async(session)
        
        rag_logger.info(f"🧹 Cleared session: {session_id[:8]}...")
        return True
    
    def delete_session(self, session_id: str) -> bool:
        """Permanently delete session"""
        # Remove from active sessions
        if session_id in self._active_sessions:
            del self._active_sessions[session_id]
        
        # Remove file
        session_file = self.storage_path / f"{session_id}.json"
        try:
            if session_file.exists():
                session_file.unlink()
                rag_logger.info(f"🗑️ Deleted session: {session_id[:8]}...")
                return True
        except Exception as e:
            rag_logger.error(f"Failed to delete session file {session_id}: {e}")
        
        return False
    
    def get_active_sessions_count(self) -> int:
        """Get count of active sessions"""
        return len(self._active_sessions)
    
    def health_check(self) -> Dict[str, Any]:
        """Health check for session storage"""
        try:
            # Test write
            test_file = self.storage_path / "health_check.tmp"
            test_file.write_text("ok")
            test_file.unlink()
            
            return {
                "status": "healthy",
                "active_sessions": len(self._active_sessions),
                "storage_path": str(self.storage_path),
                "storage_writable": True
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "active_sessions": len(self._active_sessions),
                "storage_writable": False
            }
    
    def _save_session_async(self, session: ConversationSession):
        """Save session to disk (non-blocking)"""
        try:
            session_file = self.storage_path / f"{session.session_id}.json"
            with open(session_file, 'w', encoding='utf-8') as f:
                json.dump(session.to_dict(), f, indent=2, ensure_ascii=False)
        except Exception as e:
            rag_logger.error(f"Failed to save session {session.session_id}: {e}")
    
    def _load_session(self, session_id: str) -> Optional[ConversationSession]:
        """Load session from disk"""
        session_file = self.storage_path / f"{session_id}.json"
        if not session_file.exists():
            return None
            
        try:
            with open(session_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            messages = [ChatMessage.from_dict(msg) for msg in data["messages"]]
            return ConversationSession(
                session_id=data["session_id"],
                messages=messages,
                created_at=datetime.fromisoformat(data["created_at"]),
                updated_at=datetime.fromisoformat(data["updated_at"]),
                metadata=data.get("metadata", {})
            )
        except Exception as e:
            rag_logger.error(f"Failed to load session {session_id}: {e}")
            return None
    
    def _load_recent_sessions(self):
        """Load recent sessions on startup"""
        if not self.storage_path.exists():
            return
            
        try:
            session_files = list(self.storage_path.glob("*.json"))
            loaded_count = 0
            
            for session_file in session_files:
                if session_file.name == "health_check.tmp":
                    continue
                    
                session_id = session_file.stem
                session = self._load_session(session_id)
                
                if session:
                    # Only load recent sessions
                    if datetime.now() - session.updated_at <= self.max_session_age:
                        self._active_sessions[session_id] = session
                        loaded_count += 1
                    else:
                        # Delete expired session file
                        session_file.unlink()
                
                # Limit startup loading
                if loaded_count >= 50:
                    break
                    
            rag_logger.info(f"📂 Loaded {loaded_count} recent sessions")
            
        except Exception as e:
            rag_logger.error(f"Error loading sessions: {e}")
    
    def _expire_session(self, session_id: str):
        """Expire and cleanup session"""
        if session_id in self._active_sessions:
            del self._active_sessions[session_id]
        self.delete_session(session_id)
    
    def _maybe_cleanup(self):
        """Periodic cleanup of expired sessions"""
        now = datetime.now()
        if now - self._last_cleanup < timedelta(minutes=30):
            return
            
        self._last_cleanup = now
        expired_sessions = []
        
        # Check active sessions
        for session_id, session in list(self._active_sessions.items()):
            if now - session.updated_at > self.max_session_age:
                expired_sessions.append(session_id)
        
        # Cleanup expired sessions
        for session_id in expired_sessions:
            self._expire_session(session_id)
        
        if expired_sessions:
            rag_logger.info(f"🧹 Cleaned up {len(expired_sessions)} expired sessions")

# Global session manager instance
session_manager = SessionManager(
    storage_path=os.getenv("SESSION_STORAGE_PATH", "data/sessions"),
    max_session_age_hours=int(os.getenv("SESSION_MAX_AGE_HOURS", "24"))
)
