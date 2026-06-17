from sqlalchemy.orm import Session, joinedload
from src.repositories.database import Database
from src.repositories.schemas import (
    Admin, Client, Project, ProjectStatusLog,
    Document, Agreement, Invoice, Email, Task, Payment, ActivityLog
)
from src.utils.logger import get_logger
import os
import base64
from typing import List
import resend
from fastapi import UploadFile
import base64
import sib_api_v3_sdk

from sib_api_v3_sdk.rest import ApiException

BREVO_API_KEY = os.getenv("BREVO_API_KEY")

logger = get_logger("admin_repo")

from src.repositories.schemas import Admin, OTPVerification

from datetime import datetime



class LoginRepository:

    def __init__(self):
        self.db = Database()

    def _get_session(self):
        return self.db.SessionLocal()

    # =====================================================
    # GET ADMIN
    # =====================================================

    async def get_admin_by_email(self, email: str):

        session = self._get_session()

        try:
            return (
                session.query(Admin)
                .filter(Admin.email == email)
                .first()
            )

        finally:
            session.close()

    # =====================================================
    # CREATE OTP
    # =====================================================

    async def create_otp(
        self,
        admin_id: int,
        otp_code: str,
        expires_at
    ):

        session = self._get_session()

        try:

            otp = OTPVerification(
                admin_id=admin_id,
                otp_code=otp_code,
                expires_at=expires_at
            )

            session.add(otp)

            session.commit()

            session.refresh(otp)

            return otp

        finally:
            session.close()

    # =====================================================
    # GET ACTIVE OTP
    # =====================================================

    async def get_active_otp(
        self,
        admin_id: int
    ):

        session = self._get_session()

        try:

            return (
                session.query(OTPVerification)
                .filter(
                    OTPVerification.admin_id == admin_id,
                    OTPVerification.is_verified == False
                )
                .order_by(
                    OTPVerification.created_at.desc()
                )
                .first()
            )

        finally:
            session.close()

    # =====================================================
    # MARK OTP VERIFIED
    # =====================================================

    async def mark_otp_verified(
        self,
        otp_id: int
    ):

        session = self._get_session()

        try:

            otp = (
                session.query(OTPVerification)
                .filter(
                    OTPVerification.otp_id == otp_id
                )
                .first()
            )

            if otp:
                otp.is_verified = True

                session.commit()

            return otp

        finally:
            session.close()


class ProjectRepository:
    def __init__(self):
        self.db = Database()

    def _get_session(self):
        return self.db.SessionLocal()

    async def get_client_by_email(self, email: str):
        session = self._get_session()
        try:
            logger.info("Fetching client by email", email=email)
            return session.query(Client).filter(Client.email == email).first()
        except Exception as e:
            logger.exception("Error fetching client", error=str(e))
            raise
        finally:
            session.close()

    async def create_client(self, client_data):
        session = self._get_session()
        try:
            new_client = Client(
                client_name=client_data["client_name"],
                contact_person=client_data["contact_person"],
                email=client_data["email"],
                phone=client_data["phone"]
            )
            session.add(new_client)
            session.commit()
            session.refresh(new_client)
            logger.info("Client created", client_id=new_client.client_id)
            return new_client.client_id
        except Exception as e:
            session.rollback()
            logger.exception("Error creating client", error=str(e))
            raise
        finally:
            session.close()

    async def create_project(self, project_data):
        session = self._get_session()
        try:
            new_project = Project(
                client_id=project_data["client_id"],
                project_name=project_data["project_name"],
                description=project_data["description"],
                budget=project_data["budget"],
                deadline=project_data["deadline"]
            )
            session.add(new_project)
            session.commit()
            session.refresh(new_project)
            logger.info("Project created", project_id=new_project.project_id)
            return new_project.project_id
        except Exception as e:
            session.rollback()
            logger.exception("Error creating project", error=str(e))
            raise
        finally:
            session.close()


# ── MERGED: single GetProjectRepository with ALL methods ─────────────────────
class GetProjectRepository:
    def __init__(self):
        self.db = Database()

    def _get_session(self):
        return self.db.SessionLocal()

    async def get_all_projects(self):
        session = self._get_session()
        try:
            return (
                session.query(Project)
                .options(joinedload(Project.client))
                .all()
            )
        except Exception as e:
            session.rollback()
            logger.exception("Error getting all projects", error=str(e))
            raise
        finally:
            session.close()

    async def get_project_with_client(self, project_id: int):
        session = self._get_session()
        try:
            return (
                session.query(Project)
                .options(joinedload(Project.client))
                .filter(Project.project_id == project_id)
                .first()
            )
        except Exception as e:
            logger.exception("Error fetching project with client", error=str(e))
            raise
        finally:
            session.close()

    async def get_latest_project(self):
        session = self._get_session()
        try:
            return (
                session.query(Project)
                .options(joinedload(Project.client))
                .order_by(Project.created_at.desc())
                .first()
            )
        except Exception as e:
            logger.exception("Error fetching latest project", error=str(e))
            raise
        finally:
            session.close()


class UpdateProjectStatusRepository:
    def __init__(self):
        self.db = Database()

    def _get_session(self):
        return self.db.SessionLocal()

    async def get_project_by_id(self, project_id: int):
        session = self._get_session()
        try:
            return session.query(Project).filter(Project.project_id == project_id).first()
        except Exception as e:
            logger.exception("Error fetching project", error=str(e))
            raise
        finally:
            session.close()

    async def update_project_status(self, project_id: int, new_status: str, approved_by: str):
        session = self._get_session()
        try:
            project = session.query(Project).filter(Project.project_id == project_id).first()
            if not project:
                raise Exception("Project not found")
            project.current_status = new_status
            log = ProjectStatusLog(project_id=project_id, status=new_status)
            session.add(log)
            session.commit()
            session.refresh(project)
            return {
                "project_id": project_id,
                "new_status": new_status,
                "approved_by": approved_by
            }
        except Exception as e:
            session.rollback()
            logger.exception("Error updating project status", error=str(e))
            raise
        finally:
            session.close()


class DocumentRepository:
    def __init__(self):
        self.db = Database()

    def _get_session(self):
        return self.db.SessionLocal()

    async def save_document(self, data: dict) -> int:
        session = self._get_session()
        try:
            doc = Document(
                client_id=data["client_id"],
                project_id=data["project_id"],
                file_name=data["file_name"],
                file_type=data["file_type"],
                file_url=data["file_url"],
            )
            session.add(doc)
            session.commit()
            session.refresh(doc)
            logger.info("Document saved", document_id=doc.document_id)
            return doc.document_id
        except Exception as e:
            session.rollback()
            logger.exception("Error saving document", error=str(e))
            raise
        finally:
            session.close()


class AgreementRepository:
    def __init__(self):
        self.db = Database()

    def _get_session(self):
        return self.db.SessionLocal()

    async def save_agreement(self, project_id: int, client_sig: str, company_sig: str):
        session = self._get_session()
        try:
            existing = session.query(Agreement).filter(
                Agreement.project_id == project_id
            ).first()
            if existing:
                existing.is_signed = True
                existing.client_sig = client_sig
                existing.company_sig = company_sig
                session.commit()
                return existing.agreement_id
            else:
                new_agr = Agreement(
                    project_id=project_id,
                    is_signed=True,
                    client_sig=client_sig,
                    company_sig=company_sig,
                )
                session.add(new_agr)
                session.commit()
                session.refresh(new_agr)
                return new_agr.agreement_id
        except Exception as e:
            session.rollback()
            logger.exception("Error saving agreement", error=str(e))
            raise
        finally:
            session.close()

    async def upsert_agreement(self, project_id: int, document_id: int, is_signed: bool):
        session = self._get_session()
        try:
            existing = session.query(Agreement).filter(Agreement.project_id == project_id).first()
            if existing:
                existing.document_id = document_id
                existing.is_signed = is_signed
            else:
                existing = Agreement(
                    project_id=project_id,
                    document_id=document_id,
                    is_signed=is_signed,
                )
                session.add(existing)
            session.commit()
            session.refresh(existing)
            return existing.agreement_id
        except Exception as e:
            session.rollback()
            logger.exception("Error upserting agreement", error=str(e))
            raise
        finally:
            session.close()

    async def mark_signed(self, agreement_id: int):
        session = self._get_session()
        try:
            agr = session.query(Agreement).filter(Agreement.agreement_id == agreement_id).first()
            if agr:
                agr.is_signed = True
                session.commit()
            return agr
        except Exception as e:
            session.rollback()
            logger.exception("Error marking agreement signed", error=str(e))
            raise
        finally:
            session.close()


class InvoiceRepository:
    def __init__(self):
        self.db = Database()

    def _get_session(self):
        return self.db.SessionLocal()

    async def save_invoice(self, project_id, invoice_number, base_amount,
                           gst_percentage, gst_amount, total_amount):
        session = self._get_session()
        try:
            existing = session.query(Invoice).filter(Invoice.project_id == project_id).first()
            if existing:
                existing.invoice_number = invoice_number
                existing.base_amount = base_amount
                existing.gst_percentage = gst_percentage
                existing.gst_amount = gst_amount
                existing.total_amount = total_amount
                session.commit()
                return existing.invoice_id
            else:
                new_inv = Invoice(
                    project_id=project_id,
                    invoice_number=invoice_number,
                    base_amount=base_amount,
                    gst_percentage=gst_percentage,
                    gst_amount=gst_amount,
                    total_amount=total_amount,
                )
                session.add(new_inv)
                session.commit()
                session.refresh(new_inv)
                return new_inv.invoice_id
        except Exception as e:
            session.rollback()
            logger.exception("Error saving invoice", error=str(e))
            raise
        finally:
            session.close()

    async def upsert_invoice(self, project_id: int, document_id: int,
                             invoice_number: str, base: float, gst_pct: float,
                             gst_amount: float, total: float):
        session = self._get_session()
        try:
            existing = session.query(Invoice).filter(Invoice.project_id == project_id).first()
            if existing:
                existing.document_id = document_id
                existing.invoice_number = invoice_number
                existing.base_amount = base
                existing.gst_percentage = gst_pct
                existing.gst_amount = gst_amount
                existing.total_amount = total
            else:
                existing = Invoice(
                    project_id=project_id,
                    document_id=document_id,
                    invoice_number=invoice_number,
                    base_amount=base,
                    gst_percentage=gst_pct,
                    gst_amount=gst_amount,
                    total_amount=total,
                )
                session.add(existing)
            session.commit()
            session.refresh(existing)
            return existing.invoice_id
        except Exception as e:
            session.rollback()
            logger.exception("Error upserting invoice", error=str(e))
            raise
        finally:
            session.close()

class EmailRepository:

    def __init__(self):
        self.db = Database()
        resend.api_key = os.getenv("RESEND_API_KEY")

    def _get_session(self):
        return self.db.SessionLocal()

    async def log_email(self, data: dict):
        session = self._get_session()
        try:
            email_log = Email(
                client_id=data.get("client_id"),
                project_id=data.get("project_id"),
                email_type=data.get("email_type"),
                subject=data.get("subject"),
                body=data.get("body"),
                recipient_email=data.get("recipient_email"),
                status=data.get("status", "Sent"),
                sent_at=datetime.utcnow()
            )
            session.add(email_log)
            session.commit()
            session.refresh(email_log)
            return email_log.email_id
        except Exception as e:
            session.rollback()
            logger.exception("Error logging email", error=str(e))
            raise
        finally:
            session.close()

    async def get_all_emails(self):
        session = self._get_session()
        try:
            return (
                session.query(Email)
                .options(joinedload(Email.project).joinedload(Project.client))
                .order_by(Email.created_at.desc())
                .all()
            )
        except Exception as e:
            logger.exception("Error getting all emails", error=str(e))
            raise
        finally:
            session.close()

    async def send_email(
    self,
    project_id: int,
    email_type: str,
    client_email: str,
    team_email: str,
    subject: str,
    email_body: str,
    attachments: List[UploadFile],
    request_id: str
):

        brevo_attachments = []

        for file in attachments:

            file_content = await file.read()

            brevo_attachments.append({
                "name": file.filename,
                "content": base64.b64encode(
                    file_content
                ).decode("utf-8")
            })

        client_id = None

        session = self._get_session()

        try:

            proj = (
                session.query(Project)
                .filter_by(project_id=project_id)
                .first()
            )

            if proj:
                client_id = proj.client_id

        finally:

            session.close()

        status = "Sent"

        response = None

        try:

            configuration = sib_api_v3_sdk.Configuration()

            configuration.api_key[
                "api-key"
            ] = BREVO_API_KEY

            api_instance = (
                sib_api_v3_sdk.TransactionalEmailsApi(
                    sib_api_v3_sdk.ApiClient(
                        configuration
                    )
                )
            )

            email = sib_api_v3_sdk.SendSmtpEmail(
                sender={
                    "name": "NexaFlow",
                    "email": "zeptrixinfo@gmail.com"
                },
                to=[
                    {
                        "email": client_email
                    },
                    {
                        "email": "zeptrixinfo@gmail.com"
                    }
                ],
                subject=subject,
                html_content=f"""
                <div>
                    <p>{email_body}</p>
                </div>
                """,
                attachment=brevo_attachments
            )

            response = (
                api_instance.send_transac_email(
                    email
                )
            )

            print(
                f"Email sent successfully to {client_email}"
            )

        except Exception as e:

            logger.error(
                f"Brevo send failed: {str(e)}"
            )

            status = "Failed"

        await self.log_email({
            "client_id": client_id,
            "project_id": project_id,
            "email_type": email_type,
            "subject": subject,
            "body": email_body,
            "recipient_email": client_email,
            "status": status
        })

        return {
            "project_id": project_id,
            "email_type": email_type,
            "email_sent": status == "Sent",
            "brevo_response": (
                str(response)
                if response
                else None
            )
        }


class ClientRepository:
    def __init__(self):
        self.db = Database()

    def _get_session(self):
        return self.db.SessionLocal()

    async def get_all_clients(self):
        session = self._get_session()
        try:
            return session.query(Client).all()
        finally:
            session.close()

    async def update_client(self, client_id: int, data: dict):
        session = self._get_session()
        try:
            client = session.query(Client).filter(Client.client_id == client_id).first()
            if not client:
                raise Exception("Client not found")
            for k, v in data.items():
                if hasattr(client, k):
                    setattr(client, k, v)
            session.commit()
            session.refresh(client)
            return client
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()

    async def delete_client(self, client_id: int):
        session = self._get_session()
        try:
            client = session.query(Client).filter(Client.client_id == client_id).first()
            if client:
                session.delete(client)
                session.commit()
            return True
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()


class TaskRepository:
    def __init__(self):
        self.db = Database()

    def _get_session(self):
        return self.db.SessionLocal()

    async def get_project_tasks(self, project_id: int):
        session = self._get_session()
        try:
            return (
                session.query(Task)
                .options(joinedload(Task.assigned_employee))
                .filter(Task.project_id == project_id)
                .order_by(Task.created_at.desc())
                .all()
            )
        finally:
            session.close()

    async def create_task(self, data: dict):
        session = self._get_session()
        try:
            task = Task(
                project_id=data["project_id"],
                assigned_employee_id=data.get("assigned_employee_id"),
                task_name=data["task_name"],
                description=data.get("description"),
                status=data.get("status", "Pending"),
                priority=data.get("priority", "Medium"),
                deadline=datetime.strptime(data["deadline"], "%Y-%m-%d").date() if data.get("deadline") else None,
                time_spent=data.get("time_spent", 0.0)
            )
            session.add(task)
            session.commit()
            session.refresh(task)
            return task
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()

    async def update_task(self, task_id: int, data: dict):
        session = self._get_session()
        try:
            task = session.query(Task).filter(Task.task_id == task_id).first()
            if not task:
                raise Exception("Task not found")
            for k, v in data.items():
                if k == "deadline" and v:
                    task.deadline = datetime.strptime(v, "%Y-%m-%d").date()
                elif hasattr(task, k):
                    setattr(task, k, v)
            session.commit()
            session.refresh(task)
            return task
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()

    async def delete_task(self, task_id: int):
        session = self._get_session()
        try:
            task = session.query(Task).filter(Task.task_id == task_id).first()
            if task:
                session.delete(task)
                session.commit()
            return True
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()


class FinanceRepository:
    def __init__(self):
        self.db = Database()

    def _get_session(self):
        return self.db.SessionLocal()

    async def get_all_payments(self):
        session = self._get_session()
        try:
            return (
                session.query(Payment)
                .options(joinedload(Payment.invoice).joinedload(Invoice.project))
                .order_by(Payment.payment_date.desc())
                .all()
            )
        finally:
            session.close()

    async def record_payment(self, data: dict):
        session = self._get_session()
        try:
            if "invoice_number" in data and data["invoice_number"]:
                inv = session.query(Invoice).filter(Invoice.invoice_number == data["invoice_number"]).first()
            else:
                inv = session.query(Invoice).filter(Invoice.invoice_id == data["invoice_id"]).first()
                
            if not inv:
                import random
                # Find or create a project to link the invoice to
                proj = session.query(Project).first()
                if not proj:
                    # Ensure a client exists
                    cli = session.query(Client).first()
                    if not cli:
                        cli = Client(
                            client_name="General Client",
                            email="client@nexaflow.com",
                            status="Active"
                        )
                        session.add(cli)
                        session.commit()
                        session.refresh(cli)
                    
                    proj = Project(
                        client_id=cli.client_id,
                        project_name="General Project",
                        budget=data["amount"],
                        current_status="Started"
                    )
                    session.add(proj)
                    session.commit()
                    session.refresh(proj)
                
                # Dynamically create the new invoice
                inv_num = data["invoice_number"] if data.get("invoice_number") else f"INV-{random.randint(1000, 9999)}"
                inv = Invoice(
                    project_id=proj.project_id,
                    invoice_number=inv_num,
                    base_amount=data["amount"],
                    gst_percentage=0.0,
                    gst_amount=0.0,
                    total_amount=data["amount"],
                    payment_status="Pending"
                )
                session.add(inv)
                session.commit()
                session.refresh(inv)
            # Compute total previously paid
            total_previously_paid = sum(p.amount for p in inv.payments)

            payment = Payment(
                invoice_id=inv.invoice_id,
                amount=data["amount"],
                payment_method=data.get("payment_method", "Bank Transfer"),
                payment_date=datetime.utcnow()
            )
            session.add(payment)
            
            # Compute total paid
            total_paid = total_previously_paid + data["amount"]
            if total_paid >= inv.total_amount:
                inv.payment_status = "Paid"

            
            session.commit()
            session.refresh(payment)
            return payment
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()

    async def get_all_invoices(self):
        session = self._get_session()
        try:
            return session.query(Invoice).options(joinedload(Invoice.project)).all()
        finally:
            session.close()


class EmployeeRepository:
    def __init__(self):
        self.db = Database()

    def _get_session(self):
        return self.db.SessionLocal()

    async def get_all_employees(self):
        session = self._get_session()
        try:
            return session.query(Admin).all()
        finally:
            session.close()


class ActivityLogRepository:
    def __init__(self):
        self.db = Database()

    def _get_session(self):
        return self.db.SessionLocal()

    async def log_activity(self, user_id: int, action: str, target_type: str = None, target_id: int = None):
        session = self._get_session()
        try:
            log = ActivityLog(
                user_id=user_id,
                action=action,
                target_type=target_type,
                target_id=target_id,
                timestamp=datetime.utcnow()
            )
            session.add(log)
            session.commit()
            return log
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()

    async def get_recent_activities(self, limit: int = 15):
        session = self._get_session()
        try:
            return (
                session.query(ActivityLog)
                .options(joinedload(ActivityLog.user))
                .order_by(ActivityLog.timestamp.desc())
                .limit(limit)
                .all()
            )
        finally:
            session.close()