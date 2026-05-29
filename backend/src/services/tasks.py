from src.services.celery_app import celery_app
from src.repositories.database import Database
from src.services.qdrant_service import QdrantService
from sqlalchemy.orm import Session

db_manager = Database()
qdrant_service = QdrantService()

@celery_app.task(name="tasks.sync_qdrant_knowledge_task")
def sync_qdrant_knowledge_task():
    """Background task to sync all database records to Qdrant vector index for RAG."""
    print("[Celery] Starting semantic RAG knowledge base sync...")
    session = Session(db_manager.engine)
    try:
        result = qdrant_service.sync_database_to_qdrant(session)
        print(f"[Celery] RAG sync completed successfully: {result}")
        return result
    except Exception as e:
        print(f"[Celery] Error during background knowledge base sync: {e}")
        raise e
    finally:
        session.close()
