from fastapi import APIRouter, Request
from src.utils.logger import get_logger
from src.utils.exceptions.error_codes import validation_error, ApplicationError
from src.services.services import LoginService, ProjectService, GetProjectService
import uuid
router = APIRouter(
    prefix="/dashboard",
    tags=["Auth"]
)

logger = get_logger("auth_routes")


@router.post("/login")
async def login(request: Request):
    request_id = str(uuid.uuid4())
    service=LoginService()
    try:
        body = await request.json()
        username = body.get("username")
        password = body.get("password")

        logger.info(
            "Login request received",
            username=username,
            request_id=request_id
        )

        if not username or not password:
            raise validation_error("credentials", "username or password missing")

        result = await service.login_service(username, password,request_id)

        logger.info(
            "Login successful",
            username=username,
            request_id=request_id
        )

        return {
            "status": "success",
            "data": result
        }

    except ApplicationError as ae:
        logger.warn(
            "Application error in login",
            code=ae.code,
            message=ae.message,
            request_id=request_id
        )
        raise ae

    except Exception as e:
        logger.exception(
            "Unexpected error in login",
            error=str(e),
            request_id=request_id
        )
        raise


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