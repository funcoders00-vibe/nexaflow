import logging
 
 
from dotenv import load_dotenv
load_dotenv()

logger = logging.getLogger(__name__)


from abc import ABC, abstractmethod
from datetime import datetime
from src.models.models import APIResponse
import traceback

def create_api_response(
    code: int, status: str, message: str, 
    data: dict = None, error: dict = None, request_id: str = None
) -> APIResponse:
    return APIResponse(
        code=code, status=status, message=message, 
        data=data, error=error, request_id=request_id,
        timestamp=datetime.utcnow().isoformat()
    )

def log_error(file_name: str,function_name:str,exception:Exception):
    from src.repositories.repositories import ErrorLogRepository
    try:
        repo=ErrorLogRepository()
        error_message=str(exception)
        stack_trace=traceback.format_exc()
        full_error=f"{error_message}|TRACE: {stack_trace}"
        repo.store_error(file_name=file_name,function_name=function_name,error=full_error)
    except Exception as repo_exc:
        logger.exception("Failed to store error via ErrorLogRepository: %s", repo_exc)

