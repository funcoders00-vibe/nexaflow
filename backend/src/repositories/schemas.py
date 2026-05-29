from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Text,
    Date,
    JSON
)

from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql import text
from datetime import datetime

Base = declarative_base()


# =========================================================
# ADMIN
# =========================================================

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    uuid = Column(
        String,
        server_default=text("gen_random_uuid()"),
        unique=True,
        index=True
    )

    name = Column(String)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, default="Admin")  # Admin, Manager, Developer, Sales
    salary = Column(Float, default=50000.0)
    productivity_score = Column(Float, default=85.0)

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    projects = relationship("Project", back_populates="user")
    notifications = relationship("Notification", back_populates="user")


# =========================================================
# OTP VERIFICATIONS
# =========================================================

class OTPVerification(Base):
    __tablename__ = "otp_verifications"

    otp_id = Column(Integer, primary_key=True, autoincrement=True)

    admin_id = Column(
        Integer,
        ForeignKey("admins.id"),
        nullable=False
    )

    otp_code = Column(String, nullable=False)

    attempts = Column(Integer, default=0)

    is_verified = Column(Boolean, default=False)

    expires_at = Column(DateTime, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    admin = relationship("Admin")


# =========================================================
# CLIENT
# =========================================================

class Client(Base):
    __tablename__ = "clients"

    client_id = Column(Integer, primary_key=True, autoincrement=True)

    client_name = Column(String, nullable=False)
    contact_person = Column(String)

    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String)

    address = Column(Text)
    status = Column(String, default="Active")  # Onboarding, Active, Completed, Inactive
    contract_status = Column(String, default="Pending")  # Pending, Signed, Expired
    notes = Column(Text)
    meeting_history = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    projects = relationship("Project", back_populates="client")
    documents = relationship("Document", back_populates="client")
    emails = relationship("Email", back_populates="client")


# =========================================================
# PROJECT
# =========================================================

class Project(Base):
    __tablename__ = "projects"

    project_id = Column(Integer, primary_key=True, autoincrement=True)

    client_id = Column(
        Integer,
        ForeignKey("clients.client_id"),
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("admins.id")
    )

    project_name = Column(String, nullable=False)

    description = Column(Text)

    budget = Column(Float)

    deadline = Column(Date)

    current_status = Column(String, default="Started")

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    client = relationship("Client", back_populates="projects")

    user = relationship("Admin", back_populates="projects")

    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")

    status_logs = relationship(
        "ProjectStatusLog",
        back_populates="project",
        cascade="all, delete-orphan"
    )

    agreements = relationship(
        "Agreement",
        back_populates="project",
        cascade="all, delete-orphan"
    )

    invoices = relationship(
        "Invoice",
        back_populates="project",
        cascade="all, delete-orphan"
    )

    documents = relationship(
        "Document",
        back_populates="project",
        cascade="all, delete-orphan"
    )

    emails = relationship(
        "Email",
        back_populates="project",
        cascade="all, delete-orphan"
    )


# =========================================================
# PROJECT STATUS LOG
# =========================================================

class ProjectStatusLog(Base):
    __tablename__ = "project_status_logs"

    log_id = Column(Integer, primary_key=True, autoincrement=True)

    project_id = Column(
        Integer,
        ForeignKey("projects.project_id"),
        nullable=False
    )

    status = Column(String)

    updated_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    project = relationship("Project", back_populates="status_logs")


# =========================================================
# NOTIFICATIONS
# =========================================================

class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True, autoincrement=True)

    project_id = Column(Integer, ForeignKey("projects.project_id"))

    user_id = Column(Integer, ForeignKey("admins.id"))

    message = Column(Text)

    type = Column(String)

    is_read = Column(Boolean, default=False)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("Admin", back_populates="notifications")

    project = relationship("Project")


# =========================================================
# DOCUMENTS
# =========================================================

class Document(Base):
    __tablename__ = "documents"

    document_id = Column(Integer, primary_key=True, autoincrement=True)

    client_id = Column(Integer, ForeignKey("clients.client_id"))

    project_id = Column(Integer, ForeignKey("projects.project_id"))

    # File Info
    file_name = Column(String, nullable=False)

    file_type = Column(String)

    file_url = Column(String, nullable=False)

    # IMPORTANT
    document_category = Column(String)

    """
    Example:
    - invoice
    - agreement
    - proposal
    - quotation
    - reminder_attachment
    """

    version = Column(Integer, default=1)

    status = Column(String, default="active")

    uploaded_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    client = relationship("Client", back_populates="documents")

    project = relationship("Project", back_populates="documents")


# =========================================================
# AGREEMENTS
# =========================================================

class Agreement(Base):
    __tablename__ = "agreements"

    agreement_id = Column(Integer, primary_key=True, autoincrement=True)

    # REMOVED unique=True
    project_id = Column(
        Integer,
        ForeignKey("projects.project_id"),
        nullable=False
    )

    document_id = Column(
        Integer,
        ForeignKey("documents.document_id")
    )

    agreement_version = Column(Integer, default=1)

    is_signed = Column(Boolean, default=False)

    signed_at = Column(DateTime)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="agreements")

    document = relationship("Document")


# =========================================================
# INVOICES
# =========================================================

class Invoice(Base):
    __tablename__ = "invoices"

    invoice_id = Column(Integer, primary_key=True, autoincrement=True)

    # REMOVED unique=True
    project_id = Column(
        Integer,
        ForeignKey("projects.project_id"),
        nullable=False
    )

    invoice_number = Column(
        String,
        unique=True,
        index=True
    )

    base_amount = Column(Float)

    gst_percentage = Column(Float, default=18.0)

    gst_amount = Column(Float)

    total_amount = Column(Float)

    payment_status = Column(String, default="Pending")

    """
    Example:
    - Pending
    - Paid
    - Overdue
    """

    due_date = Column(Date)

    document_id = Column(
        Integer,
        ForeignKey("documents.document_id")
    )

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="invoices")

    document = relationship("Document")

    payments = relationship("Payment", back_populates="invoice", cascade="all, delete-orphan")


# =========================================================
# EMAIL TEMPLATES
# =========================================================

class EmailTemplate(Base):
    __tablename__ = "email_templates"

    template_id = Column(Integer, primary_key=True, autoincrement=True)

    template_name = Column(String)

    """
    Example:
    - Welcome Email
    - Reminder Email
    - Invoice Email
    """

    subject = Column(String)

    body = Column(Text)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    emails = relationship("Email", back_populates="template")


# =========================================================
# EMAILS
# =========================================================

class Email(Base):
    __tablename__ = "emails"

    email_id = Column(Integer, primary_key=True, autoincrement=True)

    client_id = Column(
        Integer,
        ForeignKey("clients.client_id")
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.project_id")
    )

    template_id = Column(
        Integer,
        ForeignKey("email_templates.template_id")
    )

    email_type = Column(String)

    subject = Column(String)

    body = Column(Text)

    recipient_email = Column(String)

    cc_email = Column(String)

    status = Column(String, default="Pending")

    """
    Example:
    - Pending
    - Sent
    - Failed
    """

    sent_at = Column(DateTime)

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    client = relationship("Client", back_populates="emails")

    project = relationship("Project", back_populates="emails")

    template = relationship("EmailTemplate", back_populates="emails")

    attachments = relationship(
        "EmailAttachment",
        back_populates="email",
        cascade="all, delete-orphan"
    )


# =========================================================
# EMAIL ATTACHMENTS
# =========================================================

class EmailAttachment(Base):
    __tablename__ = "email_attachments"

    id = Column(Integer, primary_key=True, autoincrement=True)

    email_id = Column(
        Integer,
        ForeignKey("emails.email_id"),
        nullable=False
    )

    document_id = Column(
        Integer,
        ForeignKey("documents.document_id"),
        nullable=False
    )

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    email = relationship("Email", back_populates="attachments")

    document = relationship("Document")


# =========================================================
# TASKS
# =========================================================

class Task(Base):
    __tablename__ = "tasks"

    task_id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.project_id"), nullable=False)
    assigned_employee_id = Column(Integer, ForeignKey("admins.id"))
    task_name = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default="Pending")  # Pending, In Progress, Completed
    priority = Column(String, default="Medium")  # Low, Medium, High
    deadline = Column(Date)
    time_spent = Column(Float, default=0.0)  # hours
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="tasks")
    assigned_employee = relationship("Admin")


# =========================================================
# PAYMENTS
# =========================================================

class Payment(Base):
    __tablename__ = "payments"

    payment_id = Column(Integer, primary_key=True, autoincrement=True)
    invoice_id = Column(Integer, ForeignKey("invoices.invoice_id"), nullable=False)
    amount = Column(Float, nullable=False)
    payment_date = Column(DateTime, default=datetime.utcnow)
    payment_method = Column(String)  # Bank Transfer, Credit Card, UPI, etc.

    invoice = relationship("Invoice", back_populates="payments")


# =========================================================
# ACTIVITY LOGS
# =========================================================

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    log_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("admins.id"))
    action = Column(String, nullable=False)
    target_type = Column(String)  # project, task, client, invoice, payment
    target_id = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("Admin")


# =========================================================
# NEXA AI CHAT ENGINE
# =========================================================

class NexaAIChatSession(Base):
    __tablename__ = "nexa_ai_chat_sessions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_uuid = Column(String, unique=True, index=True, nullable=False)
    user_email = Column(String, nullable=False)
    title = Column(String, default="New Conversation")
    created_at = Column(DateTime, default=datetime.utcnow)

    messages = relationship("NexaAIChatMessage", back_populates="session", cascade="all, delete-orphan")


class NexaAIChatMessage(Base):
    __tablename__ = "nexa_ai_chat_messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(Integer, ForeignKey("nexa_ai_chat_sessions.id"), nullable=False)
    role = Column(String, nullable=False)  # "user" or "assistant"
    content = Column(Text, nullable=False)
    sources = Column(JSON)  # List/array of sources used
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("NexaAIChatSession", back_populates="messages")