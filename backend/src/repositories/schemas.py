from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text, Date
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
from sqlalchemy import text

Base = declarative_base()

class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    uuid = Column(String, server_default=text("gen_random_uuid()"), unique=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    projects = relationship("Project", back_populates="user")
    notifications = relationship("Notification", back_populates="user")


class Client(Base):
    __tablename__ = "clients"

    client_id = Column(Integer, primary_key=True, autoincrement=True)
    client_name = Column(String, nullable=False)
    contact_person = Column(String)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    projects = relationship("Project", back_populates="client")
    documents = relationship("Document", back_populates="client")

class Project(Base):
    __tablename__ = "projects"

    project_id = Column(Integer, primary_key=True, autoincrement=True)
    client_id = Column(Integer, ForeignKey("clients.client_id"), nullable=False)
    user_id = Column(Integer, ForeignKey("admins.id"))

    project_name = Column(String, nullable=False)
    description = Column(Text)
    budget = Column(Float)
    deadline = Column(Date)

    current_status = Column(String, default="Started")
    created_at = Column(DateTime, default=datetime.utcnow)

    
    client = relationship("Client", back_populates="projects")
    user = relationship("Admin", back_populates="projects")

    status_logs = relationship("ProjectStatusLog", back_populates="project")
    agreements = relationship("Agreement", back_populates="project", uselist=False)
    invoices = relationship("Invoice", back_populates="project", uselist=False)
    documents = relationship("Document", back_populates="project")
    emails = relationship("Email", back_populates="project")



class ProjectStatusLog(Base):
    __tablename__ = "project_status_logs"

    log_id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.project_id"), nullable=False)

    status = Column(String)
    updated_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="status_logs")


class Notification(Base):
    __tablename__ = "notifications"

    notification_id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.project_id"))
    user_id = Column(Integer, ForeignKey("admins.id"))

    message = Column(Text)
    type = Column(String)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("Admin", back_populates="notifications")
    project = relationship("Project")

class Agreement(Base):
    __tablename__ = "agreements"

    agreement_id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.project_id"), unique=True, nullable=False)
    document_id = Column(Integer, ForeignKey("documents.document_id"))

    is_signed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="agreements")
    document = relationship("Document")


class Invoice(Base):
    __tablename__ = "invoices"

    invoice_id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.project_id"), unique=True, nullable=False)

    invoice_number = Column(String, unique=True, index=True)
    base_amount = Column(Float)
    gst_percentage = Column(Float, default=18.0)
    gst_amount = Column(Float)
    total_amount = Column(Float)

    document_id = Column(Integer, ForeignKey("documents.document_id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="invoices")
    document = relationship("Document")


class EmailTemplate(Base):
    __tablename__ = "email_templates"

    template_id = Column(Integer, primary_key=True, autoincrement=True)
    template_name = Column(String)
    subject = Column(String)
    body = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    emails = relationship("Email", back_populates="template")


class Email(Base):
    __tablename__ = "emails"

    email_id = Column(Integer, primary_key=True, autoincrement=True)

    client_id = Column(Integer, ForeignKey("clients.client_id"))
    project_id = Column(Integer, ForeignKey("projects.project_id"))
    template_id = Column(Integer, ForeignKey("email_templates.template_id"))

    email_type = Column(String)
    subject = Column(String)
    body = Column(Text)
    status = Column(String)

    sent_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="emails")
    template = relationship("EmailTemplate", back_populates="emails")


class Document(Base):
    __tablename__ = "documents"

    document_id = Column(Integer, primary_key=True, autoincrement=True)

    client_id = Column(Integer, ForeignKey("clients.client_id"))
    project_id = Column(Integer, ForeignKey("projects.project_id"))

    file_name = Column(String)
    file_type = Column(String)
    file_url = Column(String)

    uploaded_at = Column(DateTime, default=datetime.utcnow)

    client = relationship("Client", back_populates="documents")
    project = relationship("Project", back_populates="documents")