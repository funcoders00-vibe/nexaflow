from src.repositories.repositories import LoginRepository, ProjectRepository
from src.utils.exceptions.error_codes import validation_error
from src.utils.logger import get_logger

logger = get_logger("auth_service")


class LoginService:
    def __init__(self):
        self.repo= LoginRepository()
    async def login_service(self,username: str, password: str,request_id:str):
        logger.info("Checking admin in database", username=username)

        admin = await self.repo.get_admin_by_email(username)

        if not admin:
            logger.warn("Admin not found", username=username)
            raise validation_error("login", "admin not found")

        if admin.password != password:
            logger.warn("Invalid password", username=username)
            raise validation_error("login", "invalid username or password")

        logger.info("Admin authenticated", admin_id=admin.id)

        return {
            "id": admin.id,
            "email": admin.email
        }
  

class ProjectService:

    def __init__(self):
        self.repo = ProjectRepository()

    async def create_project_service(self, client_data, project_data, request_id):

        logger.info("Starting project creation", request_id=request_id)

        # ✅ 1. Check if client exists
        existing_client = await self.repo.get_client_by_email(client_data["email"])

        if existing_client:
            client_id = existing_client.client_id
            logger.info("Existing client found", client_id=client_id)
        else:
            logger.info("Creating new client")
            client_id = await self.repo.create_client(client_data)

        # ✅ 2. Create project
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