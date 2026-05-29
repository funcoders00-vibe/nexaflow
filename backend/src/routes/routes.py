from fastapi import APIRouter, Request, Header, HTTPException, Depends, WebSocket, WebSocketDisconnect
from src.utils.logger import get_logger
from src.utils.exceptions.error_codes import validation_error, ApplicationError
from src.services.services import LoginService, ProjectService, GetProjectService, UpdateProjectStatusService
import resend
import random
import jwt
from datetime import datetime, timedelta 
from fastapi import UploadFile, File, Form
from typing import List
import uuid

from src.repositories.repositories import (
    ClientRepository, TaskRepository, FinanceRepository,
    EmployeeRepository, ActivityLogRepository, GetProjectRepository
)
router = APIRouter(
    prefix="/dashboard",
    tags=["Auth"]
)

logger = get_logger("auth_routes")


@router.post("/login")
async def login(request: Request):

    request_id = str(uuid.uuid4())

    service = LoginService()

    try:

        body = await request.json()

        username = body.get("username")

        password = body.get("password")

        if not username or not password:

            return {
                "status": "error",
                "message": "username/password missing"
            }

        result = await service.login_service(
            username,
            password,
            request_id
        )

        return {
            "status": "success",
            "message": "OTP sent successfully",
            "data": result
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }

# =========================================================
# VERIFY OTP
# =========================================================

@router.post("/verify-otp")
async def verify_otp(request: Request):

    service = LoginService()

    try:

        body = await request.json()

        username = body.get("username")

        otp = body.get("otp")

        result = await service.verify_otp_service(
            username,
            otp
        )

        return {
            "status": "success",
            "data": result
        }

    except Exception as e:

        return {
            "status": "error",
            "message": str(e)
        }

@router.post("/create-project")
async def create_project(request: Request):
    request_id = str(uuid.uuid4())
    service = ProjectService()

    try:
        body = await request.json()

        client = body.get("client")
        project = body.get("project")

        logger.info(
            "Create project request received",
            request_id=request_id
        )
        if not client or not project:
            raise validation_error("payload", "client or project missing")

        result = await service.create_project_service(client, project, request_id)

        return {
            "status": "success",
            "data": result
        }

    except ApplicationError as ae:
        logger.warn(
            "Application error in create project",
            code=ae.code,
            message=ae.message,
            request_id=request_id
        )
        raise ae

    except Exception as e:
        logger.exception(
            "Unexpected error in create project",
            error=str(e),
            request_id=request_id
        )
        raise

@router.get("/get-projects")
async def get_project():
    request_id=str(uuid.uuid4())
    service=GetProjectService()
    try:
        result = await service.get_project(request_id)
        logger.info("get project request received",request_id=request_id)
        print("from router....",result)
        return{
            "status":"success",
            "data": result
        }
    except ApplicationError as ae:
        logger.warn(
            "Application error in get projects",
            code=ae.code,
            message=ae.message,
            request_id=request_id
        )
        raise ae

    except Exception as e:
        logger.exception(
            "Unexpected error in get projects",
            error=str(e),
            request_id=request_id
        )
        raise

@router.patch("/update-project-status")
async def update_project_status(request: Request):
    request_id = str(uuid.uuid4())
    service = UpdateProjectStatusService()
    try:
        body = await request.json()
        project_id = body.get("project_id")
        new_status = body.get("status")
        approved_by = body.get("approved_by")
        print("project_id...",project_id)
        if not project_id or not new_status:
            raise validation_error("payload", "project_id or status missing")

        result = await service.update_status(project_id, new_status, approved_by, request_id)
        return {"status": "success", "data": result}

    except ApplicationError as ae:
        logger.warn("Application error in update status", code=ae.code, message=ae.message)
        raise ae
    except Exception as e:
        logger.exception("Unexpected error in update status", error=str(e))
        raise


# ─────────────────────────────────────────────────────────────────────────────
# ADD THESE IMPORTS to your existing routes.py
# ─────────────────────────────────────────────────────────────────────────────
from src.services.services import (
    LoginService, ProjectService, GetProjectService,
    UpdateProjectStatusService,
    GenerateAgreementService, GenerateInvoiceService,
    SignDocumentService, SendEmailService, GetEmailsService,
)

# ─────────────────────────────────────────────────────────────────────────────
# DOCUMENT ROUTES  — add after your existing routes
# ─────────────────────────────────────────────────────────────────────────────

@router.get("/latest-project")
async def get_latest_project():
    """Returns the most recently created project with client info."""
    request_id = str(uuid.uuid4())
    service = GetProjectService()
    try:
        result = await service.get_latest_project(request_id)
        return {"status": "success", "data": result}
    except ApplicationError as ae:
        logger.warn("App error in latest-project", code=ae.code, message=ae.message)
        raise ae
    except Exception as e:
        logger.exception("Error in latest-project", error=str(e))
        raise

from src.services.services import (
    LoginService, ProjectService, GetProjectService,
    UpdateProjectStatusService, GenerateAgreementService,
    GenerateInvoiceService, SendEmailService, GetEmailsService
)
 
# ── Generate Agreement ────────────────────────────────────────────────────────
@router.post("/generate-agreement")
async def generate_agreement(request: Request):
    request_id = str(uuid.uuid4())
    service = GenerateAgreementService()
    try:
        body        = await request.json()
        project_id  = body.get("project_id")
        client_sig  = body.get("client_sig")
        company_sig = body.get("company_sig")
 
        if not project_id:
            raise validation_error("payload", "project_id is required")
        if not client_sig or not company_sig:
            raise validation_error("payload", "Both client_sig and company_sig are required")
 
        result = await service.generate(project_id, client_sig, company_sig, request_id)
        return {"status": "success", "data": result}
 
    except ApplicationError as ae:
        logger.warn("App error in generate-agreement", code=ae.code, message=ae.message)
        raise ae
    except Exception as e:
        logger.exception("Unexpected error in generate-agreement", error=str(e))
        raise
 
 
# ── Generate Invoice ──────────────────────────────────────────────────────────
@router.post("/generate-invoice")
async def generate_invoice(request: Request):
    request_id = str(uuid.uuid4())
    service = GenerateInvoiceService()
    try:
        body = await request.json()
        project_id     = body.get("project_id")
        invoice_number = body.get("invoice_number")
        base_amount    = body.get("base_amount")
        gst_percentage = body.get("gst_percentage", 18.0)
        gst_amount     = body.get("gst_amount")
        total_amount   = body.get("total_amount")
 
        if not project_id or not invoice_number:
            raise validation_error("payload", "project_id and invoice_number are required")
 
        result = await service.generate(
            project_id, invoice_number, base_amount,
            gst_percentage, gst_amount, total_amount, request_id
        )
        return {"status": "success", "data": result}
 
    except ApplicationError as ae:
        logger.warn("App error in generate-invoice", code=ae.code, message=ae.message)
        raise ae
    except Exception as e:
        logger.exception("Unexpected error in generate-invoice", error=str(e))
        raise
 
 
# ── Send Email ────────────────────────────────────────────────────────────────

@router.post("/send-email")
async def send_email(
    project_id: int = Form(...),
    email_type: str = Form(...),
    client_email: str = Form(...),
    team_email: str = Form(...),
    subject: str = Form(...),
    body: str = Form(...),
    attachments: List[UploadFile] = File([])
):
    request_id = str(uuid.uuid4())

    service = SendEmailService()

    try:

        result = await service.send(
            project_id=project_id,
            email_type=email_type,
            client_email=client_email,
            team_email=team_email,
            subject=subject,
            email_body=body,
            attachments=attachments,
            request_id=request_id
        )

        return {
            "status": "success",
            "data": result
        }

    except ApplicationError as ae:
        logger.warning(
            "App error in send-email",
            code=ae.code,
            message=ae.message
        )
        raise ae

    except Exception as e:
        logger.exception(
            "Unexpected error in send-email",
            error=str(e)
        )
        raise
 
# ── Get Emails ────────────────────────────────────────────────────────────────
@router.get("/get-emails")
async def get_emails():
    request_id = str(uuid.uuid4())
    service = GetEmailsService()
    try:
        result = await service.get_all(request_id)
        return {"status": "success", "data": result}
    except ApplicationError as ae:
        logger.warn("App error in get-emails", code=ae.code, message=ae.message)
        raise ae
    except Exception as e:
        logger.exception("Unexpected error in get-emails", error=str(e))
        raise

# ─────────────────────────────────────────────────────────────────────────────
# NEW SAAS-GRADE OPERATING SYSTEM ROUTES
# ─────────────────────────────────────────────────────────────────────────────

def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    try:
        token = authorization.split(" ")[1] if " " in authorization else authorization
        payload = jwt.decode(token, "nexaflow-super-secret-key-12345", algorithms=["HS256"])
        return payload
    except Exception as e:
        logger.warning(f"JWT Verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@router.get("/auth/me")
async def auth_me(current_user: dict = Depends(get_current_user)):
    return {
        "status": "success",
        "data": current_user
    }

# ── WebSockets Manager ────────────────────────────────────────────────────────

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket client connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"WebSocket client disconnected. Remaining connections: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.warning(f"Failed to send WebSocket message: {e}")

manager = ConnectionManager()

@router.websocket("/ws/updates")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({"status": "received", "data": data})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.warning(f"WebSocket error: {e}")
        manager.disconnect(websocket)

# ── Clients CRUD ──────────────────────────────────────────────────────────────

@router.get("/clients")
async def get_clients(current_user: dict = Depends(get_current_user)):
    repo = ClientRepository()
    clients = await repo.get_all_clients()
    return {
        "status": "success",
        "data": [
            {
                "client_id": c.client_id,
                "client_name": c.client_name,
                "contact_person": c.contact_person,
                "email": c.email,
                "phone": c.phone,
                "address": c.address,
                "status": c.status,
                "contract_status": c.contract_status,
                "notes": c.notes,
                "meeting_history": c.meeting_history,
                "created_at": str(c.created_at)
            }
            for c in clients
        ]
    }

@router.post("/clients")
async def create_client(request: Request, current_user: dict = Depends(get_current_user)):
    body = await request.json()
    from src.repositories.schemas import Client
    from src.repositories.database import Database
    db = Database()
    session = db.SessionLocal()
    try:
        new_client = Client(
            client_name=body.get("client_name"),
            contact_person=body.get("contact_person"),
            email=body.get("email"),
            phone=body.get("phone"),
            address=body.get("address"),
            status=body.get("status", "Active"),
            contract_status=body.get("contract_status", "Pending"),
            notes=body.get("notes"),
            meeting_history=body.get("meeting_history")
        )
        session.add(new_client)
        session.commit()
        session.refresh(new_client)
        
        act_repo = ActivityLogRepository()
        await act_repo.log_activity(current_user["id"], f"Created client: {new_client.client_name}", "client", new_client.client_id)
        
        await manager.broadcast({
            "type": "activity",
            "message": f"{current_user['name']} created client: {new_client.client_name}"
        })
        
        return {
            "status": "success",
            "data": {
                "client_id": new_client.client_id,
                "client_name": new_client.client_name
            }
        }
    except Exception as e:
        session.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        session.close()

@router.put("/clients/{client_id}")
async def update_client(client_id: int, request: Request, current_user: dict = Depends(get_current_user)):
    body = await request.json()
    repo = ClientRepository()
    updated = await repo.update_client(client_id, body)
    
    act_repo = ActivityLogRepository()
    await act_repo.log_activity(current_user["id"], f"Updated client: {updated.client_name}", "client", client_id)
    
    await manager.broadcast({
        "type": "activity",
        "message": f"{current_user['name']} updated client: {updated.client_name}"
    })
    
    return {
        "status": "success",
        "data": {
            "client_id": updated.client_id,
            "client_name": updated.client_name,
            "status": updated.status,
            "contract_status": updated.contract_status,
            "notes": updated.notes,
            "meeting_history": updated.meeting_history
        }
    }

@router.delete("/clients/{client_id}")
async def delete_client(client_id: int, current_user: dict = Depends(get_current_user)):
    repo = ClientRepository()
    await repo.delete_client(client_id)
    
    act_repo = ActivityLogRepository()
    await act_repo.log_activity(current_user["id"], f"Deleted client ID: {client_id}", "client", client_id)
    
    await manager.broadcast({
        "type": "activity",
        "message": f"{current_user['name']} deleted client ID: {client_id}"
    })
    
    return {
        "status": "success",
        "message": "Client deleted successfully"
    }

# ── Project Tasks CRUD ────────────────────────────────────────────────────────

@router.get("/projects/{project_id}/tasks")
async def get_project_tasks(project_id: int, current_user: dict = Depends(get_current_user)):
    repo = TaskRepository()
    tasks = await repo.get_project_tasks(project_id)
    return {
        "status": "success",
        "data": [
            {
                "task_id": t.task_id,
                "project_id": t.project_id,
                "assigned_employee_id": t.assigned_employee_id,
                "assigned_employee_name": t.assigned_employee.name if t.assigned_employee else None,
                "task_name": t.task_name,
                "description": t.description,
                "status": t.status,
                "priority": t.priority,
                "deadline": str(t.deadline) if t.deadline else None,
                "time_spent": t.time_spent,
                "created_at": str(t.created_at)
            }
            for t in tasks
        ]
    }

@router.post("/projects/{project_id}/tasks")
async def create_task(project_id: int, request: Request, current_user: dict = Depends(get_current_user)):
    body = await request.json()
    repo = TaskRepository()
    data = {
        "project_id": project_id,
        "assigned_employee_id": body.get("assigned_employee_id"),
        "task_name": body.get("task_name"),
        "description": body.get("description"),
        "status": body.get("status", "Pending"),
        "priority": body.get("priority", "Medium"),
        "deadline": body.get("deadline"),
        "time_spent": body.get("time_spent", 0.0)
    }
    task = await repo.create_task(data)
    
    act_repo = ActivityLogRepository()
    await act_repo.log_activity(current_user["id"], f"Created task: {task.task_name}", "task", task.task_id)
    
    await manager.broadcast({
        "type": "task_update",
        "message": f"{current_user['name']} created task: {task.task_name}"
    })
    
    return {
        "status": "success",
        "data": {
            "task_id": task.task_id,
            "task_name": task.task_name
        }
    }

@router.put("/tasks/{task_id}")
async def update_task(task_id: int, request: Request, current_user: dict = Depends(get_current_user)):
    body = await request.json()
    repo = TaskRepository()
    task = await repo.update_task(task_id, body)
    
    act_repo = ActivityLogRepository()
    await act_repo.log_activity(current_user["id"], f"Updated task: {task.task_name} ({task.status})", "task", task_id)
    
    await manager.broadcast({
        "type": "task_update",
        "message": f"{current_user['name']} updated task: {task.task_name} to {task.status}"
    })
    
    return {
        "status": "success",
        "data": {
            "task_id": task.task_id,
            "task_name": task.task_name,
            "status": task.status
        }
    }

@router.delete("/tasks/{task_id}")
async def delete_task(task_id: int, current_user: dict = Depends(get_current_user)):
    repo = TaskRepository()
    await repo.delete_task(task_id)
    
    act_repo = ActivityLogRepository()
    await act_repo.log_activity(current_user["id"], f"Deleted task ID: {task_id}", "task", task_id)
    
    await manager.broadcast({
        "type": "task_update",
        "message": f"{current_user['name']} deleted task ID: {task_id}"
    })
    
    return {
        "status": "success",
        "message": "Task deleted successfully"
    }

# ── Finances Dashboard ────────────────────────────────────────────────────────

@router.get("/finance")
async def get_finance_overview(current_user: dict = Depends(get_current_user)):
    fin_repo = FinanceRepository()
    emp_repo = EmployeeRepository()
    
    payments = await fin_repo.get_all_payments()
    invoices = await fin_repo.get_all_invoices()
    employees = await emp_repo.get_all_employees()
    
    total_revenue = sum(p.amount for p in payments)
    total_salaries = sum(e.salary for e in employees if e.salary)
    total_gst_collected = sum(i.gst_amount for i in invoices if i.gst_amount)
    
    cashflow = {}
    for p in payments:
        month = p.payment_date.strftime("%B")
        cashflow[month] = cashflow.get(month, 0.0) + p.amount
        
    total_expenses = total_gst_collected
    total_profit = max(0.0, total_revenue - total_expenses)
    total_loss = max(0.0, total_expenses - total_revenue)
    
    return {
        "status": "success",
        "data": {
            "total_revenue": total_revenue,
            "total_salaries": total_salaries,
            "total_gst_collected": total_gst_collected,
            "total_expenses": total_expenses,
            "total_profit": total_profit,
            "total_loss": total_loss,
            "invoices": [
                {
                    "invoice_id": inv.invoice_id,
                    "invoice_number": inv.invoice_number,
                    "project_name": inv.project.project_name if inv.project else "Unknown",
                    "base_amount": inv.base_amount,
                    "gst_amount": inv.gst_amount,
                    "total_amount": inv.total_amount,
                    "payment_status": inv.payment_status,
                    "due_date": str(inv.due_date) if inv.due_date else None,
                    "created_at": str(inv.created_at)
                }
                for inv in invoices
            ],
            "payments": [
                {
                    "payment_id": pay.payment_id,
                    "invoice_number": pay.invoice.invoice_number if pay.invoice else "Unknown",
                    "amount": pay.amount,
                    "payment_date": str(pay.payment_date),
                    "payment_method": pay.payment_method
                }
                for pay in payments
            ],
            "cashflow": [{"month": m, "amount": a} for m, a in cashflow.items()]
        }
    }

@router.post("/finance/payments")
async def record_payment(request: Request, current_user: dict = Depends(get_current_user)):
    try:
        body = await request.json()
        repo = FinanceRepository()
        data = {
            "invoice_id": body.get("invoice_id"),
            "invoice_number": body.get("invoice_number"),
            "amount": body.get("amount"),
            "payment_method": body.get("payment_method", "Bank Transfer")
        }
        payment = await repo.record_payment(data)
        
        act_repo = ActivityLogRepository()
        await act_repo.log_activity(current_user["id"], f"Recorded payment: ₹{payment.amount:.2f}", "payment", payment.payment_id)
        
        await manager.broadcast({
            "type": "finance_update",
            "message": f"{current_user['name']} recorded payment of ₹{payment.amount}"
        })
        
        return {
            "status": "success",
            "data": {
                "payment_id": payment.payment_id,
                "amount": payment.amount
            }
        }
    except Exception as e:
        logger.warning(f"Failed to record payment: {e}")
        raise HTTPException(status_code=400, detail=str(e))

# ── Employees Listing & Activity Logs ──────────────────────────────────────────

@router.get("/employees")
async def get_employees(current_user: dict = Depends(get_current_user)):
    repo = EmployeeRepository()
    employees = await repo.get_all_employees()
    return {
        "status": "success",
        "data": [
            {
                "id": emp.id,
                "name": emp.name,
                "email": emp.email,
                "role": emp.role,
                "productivity_score": emp.productivity_score,
                "salary": emp.salary,
                "is_active": emp.is_active
            }
            for emp in employees
        ]
    }

@router.get("/activity-logs")
async def get_activity_logs(current_user: dict = Depends(get_current_user)):
    repo = ActivityLogRepository()
    activities = await repo.get_recent_activities(limit=20)
    return {
        "status": "success",
        "data": [
            {
                "log_id": a.log_id,
                "user_name": a.user.name if a.user else "System",
                "action": a.action,
                "target_type": a.target_type,
                "target_id": a.target_id,
                "timestamp": str(a.timestamp)
            }
            for a in activities
        ]
    }

# ── AI Insights ───────────────────────────────────────────────────────────────

@router.get("/ai/insights")
async def get_ai_insights(current_user: dict = Depends(get_current_user)):
    project_repo = GetProjectRepository()
    emp_repo = EmployeeRepository()
    
    projects = await project_repo.get_all_projects()
    employees = await emp_repo.get_all_employees()
    
    total_budget = sum(p.budget for p in projects if p.budget)
    completed_budget = sum(p.budget for p in projects if p.current_status == "Completed" and p.budget)
    
    revenue_pred = total_budget * 1.15 if total_budget else 50000.0
    
    at_risk = []
    today = datetime.utcnow().date()
    for p in projects:
        if p.deadline and p.current_status != "Completed":
            days_left = (p.deadline - today).days
            if days_left < 14:
                at_risk.append({
                    "project_id": p.project_id,
                    "project_name": p.project_name,
                    "days_remaining": days_left,
                    "risk_level": "High" if days_left < 7 else "Medium"
                })
                
    prod_scores = [e.productivity_score for e in employees if e.productivity_score]
    avg_prod = sum(prod_scores) / len(prod_scores) if prod_scores else 85.0
    
    top_performer = max(employees, key=lambda e: e.productivity_score or 0) if employees else None
    
    recommendations = []
    if at_risk:
        recommendations.append(f"Deploy resources to high-risk project: '{at_risk[0]['project_name']}' which is due in {at_risk[0]['days_remaining']} days.")
    if len(projects) > 0 and total_budget > 0 and (completed_budget / total_budget) < 0.5:
        recommendations.append("Overall project completion rate is low. Consider holding a project status sync.")
    if avg_prod < 80:
        recommendations.append("Team productivity is dropping. Schedule a training or resource review.")
    else:
        recommendations.append("Team productivity remains high. Consider allocating additional projects to developers.")
        
    return {
        "status": "success",
        "data": {
            "revenue_prediction": round(revenue_pred, 2),
            "project_risk": at_risk,
            "average_productivity": round(avg_prod, 1),
            "top_performer": top_performer.name if top_performer else "N/A",
            "recommendations": recommendations
        }
    }

@router.post("/ai/chat")
async def ai_chat(request: Request, current_user: dict = Depends(get_current_user)):
    body = await request.json()
    message = body.get("message", "")
    if not message:
        return {"status": "error", "message": "message missing"}

    from src.repositories.database import Database
    from src.services.qdrant_service import QdrantService
    from src.services.nexa_ai_service import NexaAIService
    
    db = Database()
    session = db.SessionLocal()
    qdrant = QdrantService()
    nexa_ai = NexaAIService()
    
    try:
        # Quick sync
        qdrant.sync_database_to_qdrant(session)
        # Search semantic context
        context_hits = qdrant.search_knowledge_semantic(message, limit=5)
        # Call LLM single turn
        result = nexa_ai.generate_chat_response(message, context_hits, [])
        return {
            "status": "success",
            "data": {
                "response": result["response"],
                "sources": result["sources"]
            }
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
    finally:
        session.close()


# ── Nexa AI Chat Sessions & RAG ───────────────────────────────────────────────

@router.get("/ai/sessions")
async def get_ai_sessions(current_user: dict = Depends(get_current_user)):
    from src.repositories.database import Database
    from src.repositories.schemas import NexaAIChatSession
    db = Database()
    session = db.SessionLocal()
    try:
        user_email = current_user.get("sub") or current_user.get("email")
        sessions = session.query(NexaAIChatSession).filter(
            NexaAIChatSession.user_email == user_email
        ).order_by(NexaAIChatSession.created_at.desc()).all()
        return {
            "status": "success",
            "data": [
                {
                    "session_uuid": s.session_uuid,
                    "title": s.title,
                    "created_at": s.created_at.isoformat()
                } for s in sessions
            ]
        }
    finally:
        session.close()

@router.post("/ai/sessions")
async def create_ai_session(request: Request, current_user: dict = Depends(get_current_user)):
    import uuid
    from src.repositories.database import Database
    from src.repositories.schemas import NexaAIChatSession
    db = Database()
    session = db.SessionLocal()
    try:
        user_email = current_user.get("sub") or current_user.get("email")
        body = await request.json()
        title = body.get("title", "New Conversation")
        
        session_uuid = str(uuid.uuid4())
        new_sess = NexaAIChatSession(
            session_uuid=session_uuid,
            user_email=user_email,
            title=title
        )
        session.add(new_sess)
        session.commit()
        return {
            "status": "success",
            "data": {
                "session_uuid": session_uuid,
                "title": title
            }
        }
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        session.close()

@router.delete("/ai/sessions/{session_uuid}")
async def delete_ai_session(session_uuid: str, current_user: dict = Depends(get_current_user)):
    from src.repositories.database import Database
    from src.repositories.schemas import NexaAIChatSession
    db = Database()
    session = db.SessionLocal()
    try:
        user_email = current_user.get("sub") or current_user.get("email")
        sess = session.query(NexaAIChatSession).filter(
            NexaAIChatSession.session_uuid == session_uuid,
            NexaAIChatSession.user_email == user_email
        ).first()
        if not sess:
            raise HTTPException(status_code=404, detail="Session not found")
        session.delete(sess)
        session.commit()
        return {"status": "success", "message": "Session deleted"}
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        session.close()

@router.get("/ai/sessions/{session_uuid}/messages")
async def get_session_messages(session_uuid: str, current_user: dict = Depends(get_current_user)):
    from src.repositories.database import Database
    from src.repositories.schemas import NexaAIChatSession, NexaAIChatMessage
    db = Database()
    session = db.SessionLocal()
    try:
        user_email = current_user.get("sub") or current_user.get("email")
        sess = session.query(NexaAIChatSession).filter(
            NexaAIChatSession.session_uuid == session_uuid,
            NexaAIChatSession.user_email == user_email
        ).first()
        if not sess:
            raise HTTPException(status_code=404, detail="Session not found")
        
        messages = session.query(NexaAIChatMessage).filter(
            NexaAIChatMessage.session_id == sess.id
        ).order_by(NexaAIChatMessage.created_at.asc()).all()
        
        return {
            "status": "success",
            "data": [
                {
                    "role": m.role,
                    "content": m.content,
                    "sources": m.sources,
                    "created_at": m.created_at.isoformat()
                } for m in messages
            ]
        }
    finally:
        session.close()

@router.post("/ai/sessions/{session_uuid}/chat")
async def session_chat(session_uuid: str, request: Request, current_user: dict = Depends(get_current_user)):
    from src.repositories.database import Database
    from src.repositories.schemas import NexaAIChatSession, NexaAIChatMessage
    from src.services.qdrant_service import QdrantService
    from src.services.nexa_ai_service import NexaAIService
    
    body = await request.json()
    message_text = body.get("message", "")
    if not message_text:
        raise HTTPException(status_code=400, detail="Message is required")
        
    db = Database()
    session = db.SessionLocal()
    qdrant = QdrantService()
    nexa_ai = NexaAIService()
    
    try:
        user_email = current_user.get("sub") or current_user.get("email")
        sess = session.query(NexaAIChatSession).filter(
            NexaAIChatSession.session_uuid == session_uuid,
            NexaAIChatSession.user_email == user_email
        ).first()
        if not sess:
            raise HTTPException(status_code=404, detail="Session not found")
            
        # 1. Sync latest database state to Qdrant for RAG
        qdrant.sync_database_to_qdrant(session)
        
        # 2. Semantic Search on Qdrant
        context_hits = qdrant.search_knowledge_semantic(message_text, limit=6)
        
        # 3. Retrieve conversation history (limit to latest 10 messages for memory context)
        history_msgs = session.query(NexaAIChatMessage).filter(
            NexaAIChatMessage.session_id == sess.id
        ).order_by(NexaAIChatMessage.created_at.desc()).limit(10).all()
        # Reverse to get chronological order
        history_msgs.reverse()
        
        history_list = [{"role": m.role, "content": m.content} for m in history_msgs]
        
        # 4. Invoke LLM via NexaAIService
        ai_result = nexa_ai.generate_chat_response(message_text, context_hits, history_list)
        ai_response = ai_result["response"]
        sources = ai_result["sources"]
        
        # 5. Save user message and assistant reply to PostgreSQL
        user_msg = NexaAIChatMessage(
            session_id=sess.id,
            role="user",
            content=message_text
        )
        asst_msg = NexaAIChatMessage(
            session_id=sess.id,
            role="assistant",
            content=ai_response,
            sources=sources
        )
        session.add(user_msg)
        session.add(asst_msg)
        
        # 6. Auto-generate a title if the session is still default
        if sess.title == "New Conversation" or sess.title == "New Chat":
            new_title = nexa_ai.generate_session_title(message_text)
            sess.title = new_title
            
        session.commit()
        
        return {
            "status": "success",
            "data": {
                "response": ai_response,
                "sources": sources,
                "session_title": sess.title
            }
        }
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        session.close()

@router.post("/ai/sync")
async def trigger_rag_sync(current_user: dict = Depends(get_current_user)):
    from src.repositories.database import Database
    from src.services.qdrant_service import QdrantService
    
    db = Database()
    session = db.SessionLocal()
    qdrant = QdrantService()
    try:
        result = qdrant.sync_database_to_qdrant(session)
        return result
    finally:
        session.close()


