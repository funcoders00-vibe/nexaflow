from sqlalchemy.orm import Session, joinedload
from src.repositories.database import Database
from src.repositories.schemas import Admin, Client,Project
from src.utils.logger import get_logger

logger = get_logger("admin_repo")
class LoginRepository:
    def __init__(self):
        self.db = Database()
    def _get_session(self):
        return self.db.SessionLocal()
    async def get_admin_by_email(self,email: str):
        session = self._get_session()
        try:
            logger.info("Fetching admin from DB", email=email)
            admin = session.query(Admin).filter(Admin.email == email).first()
            return admin
        except Exception as e:
            logger.exception("Database error while fetching admin", error=str(e))
            raise

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

class GetProjectRepository:
    def __init__(self):
        self.db = Database()

    def _get_session(self):
        return self.db.SessionLocal()
    async def get_all_projects(self):
        session = self._get_session()
        try:
            projects = session.query(Project).options(joinedload(Project.client)).all()
            return projects
        except Exception as e:
            session.rollback()
            logger.exception("Error in getting the project", error=str(e))
            raise
        finally:
            session.close() 

        