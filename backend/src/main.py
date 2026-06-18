from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address
from src.utils.rate_limiter import limiter

import uvicorn
import uuid
from datetime import datetime

from src.settings import config
from src.routes.routes import router
from src.repositories.database import Database
from src.utils.logger import get_logger

logger = get_logger("nexaflow")

# ---------------------------------------------------
# Global Variables
# ---------------------------------------------------
app_config = None
db_connection = None


# ---------------------------------------------------
# Validation Exception Handler
# ---------------------------------------------------
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError
):
    request_id = str(uuid.uuid4())

    logger.warning(
        "Validation error occurred",
        request_id=request_id,
        path=str(request.url),
        errors=exc.errors()
    )

    error_details = []

    for error in exc.errors():

        field_path = " -> ".join(
            str(loc) for loc in error["loc"]
        )

        msg = error["msg"]

        if "missing" in msg:
            message = f"Field '{field_path}' is required."
        elif "empty" in msg or "whitespace" in msg:
            message = (
                f"Field '{field_path}' cannot be empty."
            )
        else:
            message = f"{field_path}: {msg}"

        error_details.append(
            {
                "code": "NEXA_VAL_022",
                "message": message
            }
        )

    return JSONResponse(
        status_code=422,
        content={
            "status": "failure",
            "code": 422,
            "message": "Validation error",
            "request_id": request_id,
            "timestamp": datetime.utcnow().isoformat(),
            "errors": error_details
        }
    )


# ---------------------------------------------------
# Rate Limit Exception Handler
# ---------------------------------------------------
async def rate_limit_handler(
    request: Request,
    exc: RateLimitExceeded
):
    request_id = str(uuid.uuid4())

    logger.warning(
        "Rate limit exceeded",
        request_id=request_id,
        path=str(request.url),
        ip=get_remote_address(request)
    )

    return JSONResponse(
        status_code=429,
        content={
            "status": "failure",
            "code": "NEXA_RATE_001",
            "message": "Too many requests. Please try again later.",
            "request_id": request_id,
            "timestamp": datetime.utcnow().isoformat()
        }
    )


# ---------------------------------------------------
# Initialize Config
# ---------------------------------------------------
def initialize_config():

    global app_config, db_connection

    try:

        app_config = config
        db_connection = Database()

        logger.info(
            "Configuration initialized",
            env=getattr(app_config, "env", "local"),
            log_level=app_config.log_level
        )

        return True

    except Exception as e:

        logger.exception(
            "Failed to initialize configuration",
            error=str(e)
        )

        return False


# ---------------------------------------------------
# Create App
# ---------------------------------------------------
def create_app():

    app = FastAPI(
        title="NexaFlow",
        description="Internal Automation System",
        version="1.0.0"
    )

    # -------------------------
    # Rate Limiter
    # -------------------------
    app.state.limiter = limiter

    app.add_exception_handler(
        RateLimitExceeded,
        rate_limit_handler
    )

    app.add_middleware(SlowAPIMiddleware)

    # -------------------------
    # CORS
    # -------------------------
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "https://nexaflow.zeptrix.in"
        ],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"]
    )

    # -------------------------
    # Validation Handler
    # -------------------------
    app.add_exception_handler(
        RequestValidationError,
        validation_exception_handler
    )

    # -------------------------
    # Routers
    # -------------------------
    app.include_router(
        router,
        prefix="/api"
    )

    # -------------------------
    # Static Files
    # -------------------------
    app.mount(
        "/static",
        StaticFiles(directory="static"),
        name="static"
    )

    # -------------------------
    # Health Check
    # -------------------------
    @app.get("/")
    @limiter.limit("10/minute")
    async def root(request: Request):

        logger.info(
            "Health check endpoint called"
        )

        return {
            "status": "success",
            "message": "NexaFlow API is running"
        }

    return app


# ---------------------------------------------------
# Run Server
# ---------------------------------------------------
def run_local_server():

    if not initialize_config():

        logger.error(
            "Failed to initialize configuration"
        )

        exit(1)

    if not db_connection.test_connection():

        logger.error(
            "Database connection test failed",
            db_host=app_config.db_host,
            db_name=app_config.db_name
        )

        exit(1)

    logger.info(
        "Database connected successfully",
        db_host=app_config.db_host,
        db_name=app_config.db_name
    )

    # ------------------------------------
    # Run migrations and seeders
    # ------------------------------------
    try:

        from src.migrations.migrations import Migration
        from src.migrations.seeders import Seeder

        migration = Migration()
        migration.create_tables()

        seeder = Seeder()
        seeder.seed_data()

    except Exception as e:

        logger.warning(
            "Migration/Seeding failed",
            error=str(e)
        )

    app = create_app()

    logger.info(
        "Starting server",
        host=app_config.host,
        port=app_config.port
    )

    uvicorn.run(
        app,
        host=app_config.host,
        port=int(app_config.port),
        reload=False,
        log_level=app_config.log_level.lower(),
        access_log=True
    )


# ---------------------------------------------------
# Entry Point
# ---------------------------------------------------
if __name__ == "__main__":

    try:

        run_local_server()

    except KeyboardInterrupt:

        logger.info(
            "Server stopped by user"
        )

    except Exception as e:

        logger.exception(
            "Server startup failed",
            error=str(e)
        )

        exit(1)