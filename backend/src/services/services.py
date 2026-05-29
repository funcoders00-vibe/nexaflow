from src.repositories.repositories import LoginRepository, ProjectRepository, GetProjectRepository, UpdateProjectStatusRepository
from src.utils.exceptions.error_codes import validation_error
from src.utils.logger import get_logger
from typing import List
from fastapi import UploadFile
from passlib.hash import pbkdf2_sha256

logger = get_logger("auth_service")

import random

from datetime import datetime, timedelta

import resend

import os

resend.api_key = os.getenv("RESEND_API_KEY")

class LoginService:

    def __init__(self):

        self.repo = LoginRepository()

    # =====================================================
    # LOGIN SERVICE
    # =====================================================

    async def login_service(
        self,
        username: str,
        password: str,
        request_id: str
    ):

        admin = await self.repo.get_admin_by_email(username)

        if not admin:
            raise Exception("Admin not found")

        if not pbkdf2_sha256.verify(password, admin.password):
            raise Exception("Invalid password")

        # Generate OTP
        otp = str(random.randint(100000, 999999))

        expires_at = (
            datetime.utcnow() + timedelta(minutes=5)
        )

        # Store OTP
        await self.repo.create_otp(
            admin.id,
            otp,
            expires_at
        )

        # Send Email
        try:
            resend.Emails.send({
                "from": "NexaFlow <onboarding@resend.dev>",
                "to": [admin.email],
                "subject": "NexaFlow Login OTP",
                "html": f"""
                    <div style="font-family:sans-serif; padding:20px;">
                        <h2>NexaFlow Security Verification</h2>
                        <p>Your OTP Code:</p>
                        <div style="font-size:32px; font-weight:bold; letter-spacing:5px;">{otp}</div>
                        <p>Expires in 5 minutes.</p>
                    </div>
                """
            })
        except Exception as mail_err:
            logger.warning(f"Could not send OTP email via Resend: {mail_err}")
            # Dev fallback: print OTP to console so developers can log in
            print(f"\n========================================\n[DEV] OTP CODE FOR {admin.email}: {otp}\n========================================\n")

        return {
            "admin_id": admin.id,
            "email": admin.email
        }

    # =====================================================
    # VERIFY OTP
    # =====================================================

    async def verify_otp_service(
        self,
        username: str,
        entered_otp: str
    ):

        admin = await self.repo.get_admin_by_email(username)

        if not admin:
            raise Exception("Admin not found")

        otp_record = await self.repo.get_active_otp(
            admin.id
        )

        if not otp_record:
            raise Exception("OTP not found")

        # Expired
        if otp_record.expires_at < datetime.utcnow():
            raise Exception("OTP expired")

        # Invalid OTP
        if otp_record.otp_code != entered_otp:
            raise Exception("Invalid OTP")

        # Mark verified
        await self.repo.mark_otp_verified(
            otp_record.otp_id
        )

        # JWT generation here
        import jwt
        token = jwt.encode(
            {
                "sub": admin.email,
                "role": admin.role,
                "id": admin.id,
                "name": admin.name or "User"
            },
            "nexaflow-super-secret-key-12345",
            algorithm="HS256"
        )

        return {
            "token": token,
            "message": "OTP verified successfully"
        }
    
class ProjectService:

    def __init__(self):
        self.repo = ProjectRepository()

    async def create_project_service(self, client_data, project_data, request_id):

        logger.info("Starting project creation", request_id=request_id)

        existing_client = await self.repo.get_client_by_email(client_data["email"])

        if existing_client:
            client_id = existing_client.client_id
            logger.info("Existing client found", client_id=client_id)
        else:
            logger.info("Creating new client")
            client_id = await self.repo.create_client(client_data)

        project_data["client_id"] = client_id

        project_id = await self.repo.create_project(project_data)

        logger.info(
            "Project created successfully",
            project_id=project_id,
            request_id=request_id
        )

        # 🔥 FUTURE AUTOMATION (important)
        # await self.generate_agreement(project_id)
        # await self.generate_invoice(project_id)
        # await self.send_email(project_id)

        return {
            "project_id": project_id,
            "client_id": client_id
        }

class GetProjectService:
    def __init__(self):
        self.repo=GetProjectRepository()
    async def get_project(self,request_id:str):
        projects=await self.repo.get_all_projects()
        print("projects.....",projects)
        total_pipeline=0
        for p in projects:
            total_pipeline+=p.budget
        
        print("total_pipeline...",total_pipeline)
        return [
       {
        "project_id": p.project_id,
        "client_name": p.client.client_name,
        "project_name": p.project_name,
        "budget": p.budget,
        "deadline": str(p.deadline),
        "status": p.current_status,
        "total_pipeline": total_pipeline
    } 
    for p in projects 
] 
    
    async def get_latest_project(self, request_id: str):
        project = await self.repo.get_latest_project()
        if not project:
            raise validation_error("project", "No projects found")
        return {
            "project_id":   project.project_id,
            "project_name": project.project_name,
            "client_name":  project.client.client_name,
            "client_email": project.client.email,
            "contact_person": project.client.contact_person,
            "budget":       project.budget,
            "deadline":     str(project.deadline),
            "status":       project.current_status,
        }
    

VALID_TRANSITIONS = {
    "Started": "In Progress",
    "In Progress": "Completed",
    "Completed": None  # terminal state
}

class UpdateProjectStatusService:
    def __init__(self):
        self.repo = UpdateProjectStatusRepository()

    async def update_status(self, project_id: int, new_status: str, approved_by: str, request_id: str):
        logger.info("Updating project status", project_id=project_id, request_id=request_id)

        project = await self.repo.get_project_by_id(project_id)
        if not project:
            raise validation_error("project", "Project not found")

        current = project.current_status
        allowed_next = VALID_TRANSITIONS.get(current)

        if allowed_next is None:
            raise validation_error("status", f"Project is already Completed – no further transitions allowed")

        if new_status != allowed_next:
            raise validation_error("status", f"Invalid transition: {current} → {new_status}. Only allowed: {allowed_next}")

        if not approved_by or approved_by.strip() == "":
            raise validation_error("approval", "Approver name is required for status change")

        updated = await self.repo.update_project_status(project_id, new_status, approved_by)
        return updated



# ─────────────────────────────────────────────────────────────────────────────
# ADD TO services.py
# ─────────────────────────────────────────────────────────────────────────────
import io, base64, os, smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_RIGHT, TA_CENTER
from reportlab.platypus import Image as RLImage
from PIL import Image as PILImage

from src.repositories.repositories import (
    DocumentRepository, AgreementRepository,
    InvoiceRepository, EmailRepository, GetProjectRepository,
)
from src.utils.exceptions.error_codes import validation_error

# ── SMTP CONFIG — set via environment variables ───────────────────────────────
SMTP_HOST     = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT     = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER     = os.getenv("SMTP_USER", "your@gmail.com")       # sender address
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "your_app_password")
COMPANY_EMAIL = os.getenv("COMPANY_EMAIL", "team@yourcompany.com")
STATIC_DIR    = os.getenv("STATIC_DIR", "static/documents")    # where PDFs are saved on disk

os.makedirs(STATIC_DIR, exist_ok=True)


# ─────────────────────────────────────────────────────────────────────────────
# HELPERS
# ─────────────────────────────────────────────────────────────────────────────

def _b64_to_pil(b64_str: str) -> PILImage.Image | None:
    """Decode a base64 PNG data-URI into a PIL Image."""
    if not b64_str:
        return None
    if b64_str.startswith("data:"):
        b64_str = b64_str.split(",", 1)[1]
    raw = base64.b64decode(b64_str)
    return PILImage.open(io.BytesIO(raw))


def _pil_to_rl_image(pil_img: PILImage.Image, width_mm=60, height_mm=20):
    """Convert PIL Image to a ReportLab Image flowable."""
    buf = io.BytesIO()
    pil_img.save(buf, format="PNG")
    buf.seek(0)
    return RLImage(buf, width=width_mm * mm, height=height_mm * mm)


def _pdf_to_base64(pdf_bytes: bytes) -> str:
    return base64.b64encode(pdf_bytes).decode("utf-8")


def _save_pdf(pdf_bytes: bytes, filename: str) -> str:
    """Save PDF bytes to STATIC_DIR and return the file path."""
    path = os.path.join(STATIC_DIR, filename)
    with open(path, "wb") as f:
        f.write(pdf_bytes)
    return path


# ─────────────────────────────────────────────────────────────────────────────
# AGREEMENT PDF BUILDER
# ─────────────────────────────────────────────────────────────────────────────

def _build_agreement_pdf(project, client_sig_b64: str | None, company_sig_b64: str | None) -> bytes:
    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4,
                            leftMargin=20*mm, rightMargin=20*mm,
                            topMargin=20*mm, bottomMargin=20*mm)
    styles = getSampleStyleSheet()
    H1  = ParagraphStyle("H1",  parent=styles["Heading1"], fontSize=16, spaceAfter=6)
    H2  = ParagraphStyle("H2",  parent=styles["Heading2"], fontSize=11, spaceAfter=4, spaceBefore=10)
    BodyS = ParagraphStyle("Body", parent=styles["Normal"], fontSize=9, leading=14, spaceAfter=6)
    SmallGray = ParagraphStyle("SmallGray", parent=styles["Normal"], fontSize=8, textColor=colors.grey)
    RightS = ParagraphStyle("Right", parent=styles["Normal"], fontSize=9, alignment=TA_RIGHT)

    story = []

    # ── Header ────────────────────────────────────────────────────────────────
    header_data = [
        [Paragraph("<b>NexaFlow</b><br/><font size=8 color=grey>Automation Suite</font>", styles["Normal"]),
         Paragraph(f"<b>Service Agreement</b><br/><font size=8 color=grey>Ref: NF-{project.project_id:04d}</font>", RightS)]
    ]
    header_tbl = Table(header_data, colWidths=["50%", "50%"])
    header_tbl.setStyle(TableStyle([
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("BOTTOMPADDING", (0,0), (-1,-1), 12),
    ]))
    story.append(header_tbl)
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#e9ebf0")))
    story.append(Spacer(1, 8*mm))

    # ── Parties ───────────────────────────────────────────────────────────────
    parties_data = [
        [Paragraph("<font size=7 color=grey><b>SERVICE PROVIDER</b></font><br/>"
                   "<b>NexaFlow Automation Suite</b><br/>"
                   "<font size=8 color=grey>122 Innovation Way, San Francisco, CA 94103</font>", styles["Normal"]),
         Paragraph(f"<font size=7 color=grey><b>PREPARED FOR</b></font><br/>"
                   f"<b>{project.client.client_name}</b><br/>"
                   f"<font size=8 color=grey>{project.client.email}</font>", styles["Normal"])]
    ]
    parties_tbl = Table(parties_data, colWidths=["50%", "50%"])
    parties_tbl.setStyle(TableStyle([
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("BACKGROUND", (0,0), (-1,-1), colors.HexColor("#fafbfd")),
        ("BOX", (0,0), (-1,-1), 0.5, colors.HexColor("#e9ebf0")),
        ("PADDING", (0,0), (-1,-1), 8),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
    ]))
    story.append(parties_tbl)
    story.append(Spacer(1, 6*mm))

    # ── Sections ──────────────────────────────────────────────────────────────
    story.append(Paragraph("1. Project Overview", H2))
    story.append(Paragraph(
        f"This agreement covers <b>{project.project_name}</b> with an agreed budget of "
        f"<b>₹{project.budget:,.2f}</b> and a deadline of <b>{project.deadline}</b>. "
        f"NexaFlow will provide end-to-end automation, monitoring, and secure pipeline management.",
        BodyS))

    story.append(Paragraph("2. Scope of Work", H2))
    scope_items = [
        "Full project delivery as per agreed specification and timeline.",
        "Regular progress updates and milestone reporting.",
        "24/7 priority support throughout the project lifecycle.",
        "Post-delivery bug fixes and support for 30 days.",
    ]
    for item in scope_items:
        story.append(Paragraph(f"• {item}", BodyS))

    story.append(Paragraph("3. Financial Summary", H2))
    gst = round(project.budget * 0.18, 2)
    total = round(project.budget + gst, 2)
    fin_data = [
        ["Description", "Amount (₹)"],
        ["Project Base Cost", f"₹{project.budget:,.2f}"],
        ["GST (18%)", f"₹{gst:,.2f}"],
        ["Total Payable", f"₹{total:,.2f}"],
    ]
    fin_tbl = Table(fin_data, colWidths=["70%", "30%"])
    fin_tbl.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#1d4ed8")),
        ("TEXTCOLOR", (0,0), (-1,0), colors.white),
        ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
        ("FONTSIZE", (0,0), (-1,-1), 9),
        ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white, colors.HexColor("#f7f8fb")]),
        ("GRID", (0,0), (-1,-1), 0.5, colors.HexColor("#e9ebf0")),
        ("PADDING", (0,0), (-1,-1), 7),
        ("FONTNAME", (0,-1), (-1,-1), "Helvetica-Bold"),
    ]))
    story.append(fin_tbl)
    story.append(Spacer(1, 10*mm))

    # ── Signature Section ────────────────────────────────────────────────────
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#e9ebf0")))
    story.append(Spacer(1, 6*mm))
    story.append(Paragraph("4. Signatures", H2))
    story.append(Paragraph(
        "By signing below, both parties agree to the terms and conditions set out in this agreement.",
        BodyS))
    story.append(Spacer(1, 4*mm))

    # Build signature cells
    def sig_cell(label: str, b64: str | None) -> list:
        cell = [Paragraph(f"<font size=7 color=grey><b>{label.upper()}</b></font>", styles["Normal"])]
        pil = _b64_to_pil(b64)
        if pil:
            cell.append(_pil_to_rl_image(pil, width_mm=70, height_mm=22))
        else:
            cell.append(Spacer(1, 22*mm))
        cell.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#374151")))
        cell.append(Paragraph(f"<font size=8>{label}</font>", SmallGray))
        return cell

    sig_tbl = Table(
        [[sig_cell("Client Signature", client_sig_b64),
          sig_cell("NexaFlow Authorised Signatory", company_sig_b64)]],
        colWidths=["50%", "50%"]
    )
    sig_tbl.setStyle(TableStyle([
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("PADDING", (0,0), (-1,-1), 8),
    ]))
    story.append(sig_tbl)

    doc.build(story)
    return buf.getvalue()


# ─────────────────────────────────────────────────────────────────────────────
# INVOICE PDF BUILDER
# ─────────────────────────────────────────────────────────────────────────────

def _build_invoice_pdf(project, invoice_number: str, gst_pct: float) -> bytes:
    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4,
                            leftMargin=20*mm, rightMargin=20*mm,
                            topMargin=20*mm, bottomMargin=20*mm)
    styles = getSampleStyleSheet()
    H2  = ParagraphStyle("H2",  parent=styles["Heading2"], fontSize=11, spaceAfter=4, spaceBefore=10)
    BodyS = ParagraphStyle("Body", parent=styles["Normal"], fontSize=9, leading=14, spaceAfter=4)
    RightS = ParagraphStyle("Right", parent=styles["Normal"], fontSize=9, alignment=TA_RIGHT)

    story = []

    # Header
    header_data = [
        [Paragraph("<b>NexaFlow</b><br/><font size=8 color=grey>Tax Invoice</font>", styles["Normal"]),
         Paragraph(f"<b>{invoice_number}</b><br/>"
                   f"<font size=8 color=grey>Date: {project.deadline}</font>", RightS)]
    ]
    header_tbl = Table(header_data, colWidths=["50%", "50%"])
    header_tbl.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("BOTTOMPADDING",(0,0),(-1,-1),12)]))
    story.append(header_tbl)
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#e9ebf0")))
    story.append(Spacer(1, 8*mm))

    # Bill To
    story.append(Paragraph("Bill To", H2))
    story.append(Paragraph(
        f"<b>{project.client.client_name}</b><br/>"
        f"<font size=8 color=grey>{project.client.email}<br/>"
        f"Contact: {project.client.contact_person or 'N/A'}</font>", BodyS))
    story.append(Spacer(1, 6*mm))

    # Items table
    story.append(Paragraph("Invoice Items", H2))
    base = project.budget
    gst  = round(base * gst_pct / 100, 2)
    total = round(base + gst, 2)

    items_data = [
        ["#", "Description", "Amount (₹)"],
        ["1", f"Project: {project.project_name}", f"₹{base:,.2f}"],
        ["", f"GST @ {gst_pct}%", f"₹{gst:,.2f}"],
        ["", "Total Payable", f"₹{total:,.2f}"],
    ]
    items_tbl = Table(items_data, colWidths=["8%", "62%", "30%"])
    items_tbl.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#1d4ed8")),
        ("TEXTCOLOR", (0,0), (-1,0), colors.white),
        ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
        ("FONTSIZE", (0,0), (-1,-1), 9),
        ("ROWBACKGROUNDS", (0,1), (-1,-2), [colors.white, colors.HexColor("#f7f8fb")]),
        ("GRID", (0,0), (-1,-1), 0.5, colors.HexColor("#e9ebf0")),
        ("PADDING", (0,0), (-1,-1), 8),
        ("FONTNAME", (0,-1), (-1,-1), "Helvetica-Bold"),
        ("BACKGROUND", (0,-1), (-1,-1), colors.HexColor("#eff3ff")),
        ("TEXTCOLOR", (0,-1), (-1,-1), colors.HexColor("#1d4ed8")),
    ]))
    story.append(items_tbl)
    story.append(Spacer(1, 10*mm))

    # Footer note
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#e9ebf0")))
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph(
        "Payment is due within 30 days of invoice date. Please contact us at billing@nexaflow.io for any queries.",
        ParagraphStyle("Footer", parent=styles["Normal"], fontSize=8, textColor=colors.grey)))

    doc.build(story)
    return buf.getvalue()


# ─────────────────────────────────────────────────────────────────────────────
# SERVICES
# ─────────────────────────────────────────────────────────────────────────────

class GenerateAgreementService:
    def __init__(self):
        self.project_repo  = GetProjectRepository()
        self.doc_repo      = DocumentRepository()
        self.agreement_repo = AgreementRepository()

    async def generate(self, project_id: int, client_sig: str | None,
                       company_sig: str | None, request_id: str):
        logger.info("Generating agreement", project_id=project_id, request_id=request_id)
        project = await self.project_repo.get_project_with_client(project_id)
        if not project:
            raise validation_error("project", "Project not found")

        pdf_bytes = _build_agreement_pdf(project, client_sig, company_sig)
        filename  = f"agreement_{project_id}.pdf"
        file_path = _save_pdf(pdf_bytes, filename)

        # Save document record
        doc_id = await self.doc_repo.save_document({
            "client_id":  project.client_id,
            "project_id": project_id,
            "file_name":  filename,
            "file_type":  "agreement",
            "file_url":   file_path,
        })

        # Upsert agreement record
        is_signed = bool(client_sig and company_sig)
        await self.agreement_repo.upsert_agreement(project_id, doc_id, is_signed)

        return {
            "document_id": doc_id,
            "file_url":    file_path,
            "is_signed":   is_signed,
            "pdf_base64":  _pdf_to_base64(pdf_bytes),
        }


class GenerateInvoiceService:
    def __init__(self):
        self.project_repo = GetProjectRepository()
        self.doc_repo     = DocumentRepository()
        self.invoice_repo = InvoiceRepository()

    async def generate(self, project_id: int, invoice_number: str, base_amount: float,
                       gst_percentage: float, gst_amount: float, total_amount: float, request_id: str):
        logger.info("Generating invoice", project_id=project_id, request_id=request_id)
        project = await self.project_repo.get_project_with_client(project_id)
        if not project:
            raise validation_error("project", "Project not found")

        pdf_bytes = _build_invoice_pdf(project, invoice_number, gst_percentage)
        filename  = f"invoice_{project_id}.pdf"
        file_path = _save_pdf(pdf_bytes, filename)

        doc_id = await self.doc_repo.save_document({
            "client_id":  project.client_id,
            "project_id": project_id,
            "file_name":  filename,
            "file_type":  "invoice",
            "file_url":   file_path,
        })

        await self.invoice_repo.upsert_invoice(
            project_id=project_id,
            document_id=doc_id,
            invoice_number=invoice_number,
            base=base_amount,
            gst_pct=gst_percentage,
            gst_amount=gst_amount,
            total=total_amount
        )

        return {
            "document_id":     doc_id,
            "invoice_number":  invoice_number,
            "base_amount":     base_amount,
            "gst_percentage":  gst_percentage,
            "gst_amount":      gst_amount,
            "total_amount":    total_amount,
            "pdf_base64":      _pdf_to_base64(pdf_bytes),
        }


class SignDocumentService:
    def __init__(self):
        self.agreement_repo = AgreementRepository()

    async def sign(self, agreement_id: int, client_sig: str | None,
                   company_sig: str | None, request_id: str):
        result = await self.agreement_repo.mark_signed(agreement_id)
        return {"agreement_id": agreement_id, "is_signed": True}


class SendEmailService:
    def __init__(self):
        self.repo = EmailRepository()

    async def send(
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
        result = await self.repo.send_email(
            project_id=project_id,
            email_type=email_type,
            client_email=client_email,
            team_email=team_email,
            subject=subject,
            email_body=email_body,
            attachments=attachments,
            request_id=request_id
        )
        return result


class GetEmailsService:
    def __init__(self):
        self.repo = EmailRepository()

    async def get_all(self, request_id):
        emails = await self.repo.get_all_emails()
        return [
            {
                "email_id":    e.email_id,
                "client_name": e.project.client.client_name if e.project and e.project.client else "—",
                "client_email": e.project.client.email if e.project and e.project.client else "—",
                "project_name": e.project.project_name if e.project else "—",
                "email_type":  e.email_type,
                "subject":     e.subject,
                "status":      e.status,
                "sent_at":     str(e.sent_at),
            }
            for e in emails
        ]
 
 
