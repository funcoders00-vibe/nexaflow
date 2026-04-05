from sqlalchemy import inspect
from src.repositories.database import Database

from src.repositories.schemas import (
    Admin,
    Client,
    Project,
    ProjectStatusLog,
    Notification,
    Document,
    Agreement,
    Invoice,
    EmailTemplate,
    Email
)

TABLE_ORDER_CREATION = [
    Admin.__tablename__,          

    Client.__tablename__,             

    Project.__tablename__,        

    ProjectStatusLog.__tablename__, 
    Notification.__tablename__,      

    Document.__tablename__,         
    Agreement.__tablename__,         
    Invoice.__tablename__,           
    EmailTemplate.__tablename__,     
    Email.__tablename__,             
]


MODEL_CLASSES = {
    Admin.__tablename__: Admin,

    Client.__tablename__: Client,
    Project.__tablename__: Project,

    ProjectStatusLog.__tablename__: ProjectStatusLog,
    Notification.__tablename__: Notification,

    Document.__tablename__: Document,
    Agreement.__tablename__: Agreement,
    Invoice.__tablename__: Invoice,

    EmailTemplate.__tablename__: EmailTemplate,
    Email.__tablename__: Email,
}


class Migration:

    def __init__(self):
        self.db = Database()
        self.engine = self.db.engine
        self.inspector = inspect(self.engine)

    def create_tables(self):

        for table_name in TABLE_ORDER_CREATION:

            if not self.inspector.has_table(table_name):
                print(f"Creating table: {table_name}")  # debug log
                MODEL_CLASSES[table_name].__table__.create(bind=self.engine)

            else:
                print(f"Table already exists: {table_name}")