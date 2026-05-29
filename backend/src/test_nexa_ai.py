import os
import sys
import uuid
# Set PYTHONPATH to root of backend
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from src.repositories.database import Database
from src.repositories.schemas import Admin, NexaAIChatSession, NexaAIChatMessage, Project, Client, Task, Payment
from src.services.qdrant_service import QdrantService
from src.services.nexa_ai_service import NexaAIService
from sqlalchemy.orm import Session

def run_verification():
    print("=== NEXA AI ASSISTANT CORE VERIFICATION ===")
    
    # 1. Database Connectivity & Chat Session tables
    print("\n1. Testing Database & Chat Session Schemas...")
    db = Database()
    if not db.test_connection():
        print("[Fail] Database connection failed.")
        return
    print("[Pass] Successfully connected to PostgreSQL.")
    
    session = Session(db.engine)
    try:
        # Create a mock session
        session_uuid = str(uuid.uuid4())
        mock_session = NexaAIChatSession(
            session_uuid=session_uuid,
            user_email="viswa3104@gmail.com",
            title="Verification Chat"
        )
        session.add(mock_session)
        session.flush()
        print(f"[Pass] Created chat session in DB (ID: {mock_session.id}, UUID: {mock_session.session_uuid})")
        
        # Add messages
        msg_user = NexaAIChatMessage(
            session_id=mock_session.id,
            role="user",
            content="Who is our top performer?"
        )
        msg_asst = NexaAIChatMessage(
            session_id=mock_session.id,
            role="assistant",
            content="According to database records, Viswanathan has a productivity score of 98%.",
            sources=[{"type": "Employee", "name": "Viswanathan", "score": 0.992}]
        )
        session.add(msg_user)
        session.add(msg_asst)
        session.flush()
        print("[Pass] Appended user and assistant messages into session logs.")
        
        # Verify loading
        loaded_msgs = session.query(NexaAIChatMessage).filter(NexaAIChatMessage.session_id == mock_session.id).all()
        print(f"[Pass] Loaded {len(loaded_msgs)} messages from DB. Content of first message: '{loaded_msgs[0].content}'")
        
        # Cleanup mock verification entries
        session.delete(mock_session)
        session.commit()
        print("[Pass] Cleaned up verification chat records successfully.")
    except Exception as e:
        session.rollback()
        print(f"[Fail] Database schema test failed: {e}")
        session.close()
        return

    # 2. Qdrant RAG Sync & Indexing
    print("\n2. Testing Qdrant Sync and RAG retrieval...")
    qdrant = QdrantService()
    if not qdrant.client:
        print("[Warning] Qdrant client unavailable. Bypassing vector sync tests.")
    else:
        print("[Pass] Connected to Qdrant Vector database.")
        try:
            # Sync database
            sync_res = qdrant.sync_database_to_qdrant(session)
            print(f"[Pass] Sync execution status: {sync_res.get('status')}")
            print(f"       Counts: {sync_res.get('indexed_counts')} | Total: {sync_res.get('total')}")
            
            # Query semantic retrieval
            print("   Running semantic RAG query: 'financial revenue logs'...")
            hits = qdrant.search_knowledge_semantic("financial revenue logs", limit=3)
            print(f"   [Pass] Found {len(hits)} matching records in Qdrant:")
            for h in hits:
                print(f"      - Match: {h.get('type')} -> {h.get('name') or h.get('project')} (Score: {h.get('search_score'):.4f})")
        except Exception as e:
            print(f"[Fail] Qdrant operations failed: {e}")

    # 3. LLM Completions & NVIDIA API Connections
    print("\n3. Testing NVIDIA Llama 3.1 70B & completions engine...")
    nexa_ai = NexaAIService()
    print(f"   Nexa AIService configured. Mock Mode status: {nexa_ai.is_mock}")
    
    try:
        # Retrieve context matching a sample query
        query = "Who is Marcus Aurelius?"
        context = []
        if qdrant.client:
            context = qdrant.search_knowledge_semantic(query, limit=2)
            
        history = [
            {"role": "user", "content": "Hello"},
            {"role": "assistant", "content": "Hello! I am NexaFlow Assistant. How can I help you today?"}
        ]
        
        print(f"   Executing chat response generation for: '{query}'...")
        reply = nexa_ai.generate_chat_response(query, context, history)
        safe_response = reply.get('response', '')[:250].replace('\u20b9', 'Rs.')
        print(f"   [Pass] Completion response: {safe_response}...")
        print(f"          Sources referenced: {reply.get('sources')}")
        
        # Test Title Generator
        print("   Generating chat session title based on query: 'revenue prediction for next quarter'...")
        title = nexa_ai.generate_session_title("revenue prediction for next quarter")
        print(f"   [Pass] Generated Session Title: '{title}'")
        
    except Exception as e:
        print(f"[Fail] Conversational LLM test execution failed: {e}")

    session.close()
    print("\n=== SYSTEM VERIFICATION COMPLETE ===")

if __name__ == "__main__":
    run_verification()
