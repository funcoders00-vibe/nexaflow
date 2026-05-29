from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
import os
import random
import hashlib
import uuid
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from src.repositories.schemas import Admin, Client, Project, Task, Payment

class QdrantService:
    def __init__(self):
        self.collection_name = "nexa_flow_knowledge"
        self.qdrant_host = os.getenv("QDRANT_HOST", "")
        self.qdrant_api_key = os.getenv("QDRANT_API_KEY", "")
        self.nvidia_api_key = os.getenv("NVIDIA_API_KEY", "")
        
        # Connect to Qdrant server if host is configured, otherwise fallback to local disk persistent store
        try:
            if self.qdrant_host:
                self.client = QdrantClient(url=self.qdrant_host, api_key=self.qdrant_api_key)
            else:
                # Store local vector database within the backend folder
                storage_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "qdrant_storage")
                os.makedirs(storage_path, exist_ok=True)
                self.client = QdrantClient(path=storage_path)
            
            self._init_collection()
        except Exception as e:
            print(f"[QdrantService] Failed to initialize Qdrant client: {e}. Fallback to mock state.")
            self.client = None

    def _init_collection(self):
        """Initializes the collection with 2048 dimensions (Llama-Nemotron standard)"""
        if not self.client:
            return
        try:
            collections = self.client.get_collections().collections
            exists = any(c.name == self.collection_name for c in collections)
            
            if not exists:
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(size=2048, distance=Distance.COSINE)
                )
                print(f"[QdrantService] Created vector collection: {self.collection_name}")
        except Exception as e:
            print(f"[QdrantService] Collection check/creation failed: {e}")

    def _get_embedding(self, text: str, input_type: str = "passage") -> List[float]:
        """Generates a 2048-dimensional embedding. Falls back to a deterministic vector based on text content."""
        if self.nvidia_api_key and self.nvidia_api_key != "mock_nvidia_api_key":
            try:
                from openai import OpenAI
                client = OpenAI(
                    base_url="https://integrate.api.nvidia.com/v1",
                    api_key=self.nvidia_api_key
                )
                response = client.embeddings.create(
                    input=[text],
                    model="nvidia/llama-nemotron-embed-1b-v2",
                    extra_body={"input_type": input_type}
                )
                return response.data[0].embedding
            except Exception as err:
                print(f"[QdrantService] NVIDIA embeddings error: {err}. Falling back to deterministic pseudo-embedding.")
 
        # Deterministic mock embedding generator: seeds random engine with text hash
        hasher = hashlib.sha256(text.encode('utf-8'))
        seed = int(hasher.hexdigest()[:8], 16)
        rng = random.Random(seed)
        
        vector = [rng.uniform(-1.0, 1.0) for _ in range(2048)]
        
        # Normalize the vector (for cosine distance)
        norm = sum(x*x for x in vector) ** 0.5
        if norm > 0:
            vector = [x / norm for x in vector]
            
        return vector

    def sync_database_to_qdrant(self, db: Session) -> Dict[str, Any]:
        """Syncs all dynamic database entities into Qdrant vectors for RAG context queries."""
        if not self.client:
            return {"status": "error", "message": "Qdrant client not initialized"}

        points = []
        indexed_counts = {
            "Employee": 0,
            "Client": 0,
            "Project": 0,
            "Task": 0,
            "Finance": 0
        }

        try:
            # 1. Index Employees (Admin table)
            employees = db.query(Admin).all()
            for emp in employees:
                name = emp.name or "N/A"
                role = emp.role or "Employee"
                email = emp.email
                salary = emp.salary or 0.0
                prod = emp.productivity_score or 85.0
                active = "Yes" if emp.is_active else "No"
                text_doc = f"Employee: {name} | Role: {role} | Email: {email} | Salary: ₹{salary:,.2f} | Productivity Score: {prod}% | Active: {active}"
                
                point_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"employee_{emp.id}"))
                vector = self._get_embedding(text_doc)
                payload = {
                    "entity_id": emp.id,
                    "type": "Employee",
                    "name": name,
                    "role": role,
                    "email": email,
                    "salary": salary,
                    "productivity": prod,
                    "text_content": text_doc
                }
                points.append(PointStruct(id=point_id, vector=vector, payload=payload))
                indexed_counts["Employee"] += 1

            # 2. Index Clients
            clients = db.query(Client).all()
            for cli in clients:
                name = cli.client_name
                contact = cli.contact_person or "N/A"
                email = cli.email
                phone = cli.phone or "N/A"
                status = cli.status or "Active"
                contract = cli.contract_status or "Pending"
                notes = cli.notes or ""
                text_doc = f"Client: {name} | Contact Person: {contact} | Email: {email} | Phone: {phone} | Status: {status} | Contract Status: {contract} | Notes: {notes}"
                
                point_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"client_{cli.client_id}"))
                vector = self._get_embedding(text_doc)
                payload = {
                    "entity_id": cli.client_id,
                    "type": "Client",
                    "name": name,
                    "contact_person": contact,
                    "email": email,
                    "phone": phone,
                    "status": status,
                    "contract_status": contract,
                    "text_content": text_doc
                }
                points.append(PointStruct(id=point_id, vector=vector, payload=payload))
                indexed_counts["Client"] += 1

            # 3. Index Projects
            projects = db.query(Project).all()
            for proj in projects:
                name = proj.project_name
                desc = proj.description or ""
                budget = proj.budget or 0.0
                deadline = str(proj.deadline) if proj.deadline else "N/A"
                status = proj.current_status or "Started"
                client_name = proj.client.client_name if proj.client else "N/A"
                text_doc = f"Project: {name} | Description: {desc} | Budget: ₹{budget:,.2f} | Deadline: {deadline} | Status: {status} | Client: {client_name}"
                
                point_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"project_{proj.project_id}"))
                vector = self._get_embedding(text_doc)
                payload = {
                    "entity_id": proj.project_id,
                    "type": "Project",
                    "name": name,
                    "status": status,
                    "budget": budget,
                    "deadline": deadline,
                    "client": client_name,
                    "text_content": text_doc
                }
                points.append(PointStruct(id=point_id, vector=vector, payload=payload))
                indexed_counts["Project"] += 1

            # 4. Index Tasks
            tasks = db.query(Task).all()
            for t in tasks:
                name = t.title
                proj_name = t.project.project_name if t.project else "N/A"
                assigned_to = t.assigned_employee.name if t.assigned_employee else "N/A"
                status = t.status or "Pending"
                priority = t.priority or "Medium"
                desc = t.description or ""
                due_date = str(t.due_date) if t.due_date else "N/A"
                text_doc = f"Task: {name} | Project: {proj_name} | Assigned To: {assigned_to} | Status: {status} | Priority: {priority} | Description: {desc} | Due Date: {due_date}"
                
                point_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"task_{t.task_id}"))
                vector = self._get_embedding(text_doc)
                payload = {
                    "entity_id": t.task_id,
                    "type": "Task",
                    "name": name,
                    "project": proj_name,
                    "assigned_to": assigned_to,
                    "status": status,
                    "priority": priority,
                    "due_date": due_date,
                    "text_content": text_doc
                }
                points.append(PointStruct(id=point_id, vector=vector, payload=payload))
                indexed_counts["Task"] += 1

            # 5. Index Payments/Finances
            payments = db.query(Payment).all()
            for pay in payments:
                proj_name = pay.project.project_name if pay.project else "N/A"
                client_name = pay.client.client_name if pay.client else "N/A"
                amount = pay.amount or 0.0
                date = str(pay.payment_date) if pay.payment_date else "N/A"
                status = pay.payment_status or "Pending"
                notes = pay.notes or ""
                text_doc = f"Payment/Finance: Client {client_name} paid ₹{amount:,.2f} for project '{proj_name}' | Date: {date} | Status: {status} | Notes: {notes}"
                
                point_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, f"payment_{pay.payment_id}"))
                vector = self._get_embedding(text_doc)
                payload = {
                    "entity_id": pay.payment_id,
                    "type": "Finance",
                    "client": client_name,
                    "project": proj_name,
                    "amount": amount,
                    "date": date,
                    "status": status,
                    "text_content": text_doc
                }
                points.append(PointStruct(id=point_id, vector=vector, payload=payload))
                indexed_counts["Finance"] += 1

            # Perform Qdrant Upsert
            if points:
                # Re-create/clear collection to ensure fresh indexes
                try:
                    self.client.delete_collection(self.collection_name)
                except Exception:
                    pass
                self._init_collection()

                # Chunk upsert (Qdrant recommends max 100 points per batch in small servers)
                chunk_size = 50
                for i in range(0, len(points), chunk_size):
                    chunk = points[i:i + chunk_size]
                    self.client.upsert(
                        collection_name=self.collection_name,
                        points=chunk
                    )
            return {"status": "success", "indexed_counts": indexed_counts, "total": len(points)}

        except Exception as e:
            print(f"[QdrantService] Failed to index database contents: {e}")
            return {"status": "error", "message": str(e)}

    def search_knowledge_semantic(self, query: str, limit: int = 6) -> List[Dict[str, Any]]:
        """Queries Qdrant vector store to match user questions with indexed database records."""
        if not self.client:
            return []
        try:
            collections = self.client.get_collections().collections
            exists = any(c.name == self.collection_name for c in collections)
            if not exists:
                return []
                
            query_vector = self._get_embedding(query, input_type="query")
            search_results = self.client.query_points(
                collection_name=self.collection_name,
                query=query_vector,
                limit=limit
            )
            
            results = []
            for hit in search_results.points:
                payload = hit.payload or {}
                payload["search_score"] = hit.score
                results.append(payload)
                
            return results
        except Exception as e:
            print(f"[QdrantService] Semantic RAG query search failed: {e}")
            return []
