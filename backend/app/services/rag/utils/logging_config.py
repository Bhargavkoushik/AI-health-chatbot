import sys
from loguru import logger
from pathlib import Path

# Configure logger
logger.remove()  # Remove default handler

# Console logging
logger.add(
    sys.stdout,
    format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan> | <level>{message}</level>",
    level="INFO",
    colorize=True
)

# File logging
log_path = Path("logs/rag_system.log")
log_path.parent.mkdir(exist_ok=True)

logger.add(
    str(log_path),
    format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} | {message}",
    level="DEBUG",
    rotation="10 MB",
    retention="7 days"
)

rag_logger = logger.bind(name="RAG")
