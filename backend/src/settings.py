from dataclasses import dataclass
import os
from dotenv import load_dotenv
load_dotenv()

@dataclass
class Config:
    DATABASE_URL:str
    db_port: str
    db_host: str
    db_name: str
    port: int
    host: str
    log_level: str
    jwt_secret_key: str

def get_config():
    return Config(
        DATABASE_URL=os.getenv('DATABASE_URL'),
        db_port=os.getenv('DB_PORT'),
        db_host=os.getenv('DB_HOST'),
        db_name=os.getenv('DB_NAME'),
        port=int(os.getenv('PORT')),
        host=os.getenv('HOST'),
        log_level=os.getenv('LOG_LEVEL'),
        jwt_secret_key=os.getenv('JWT_SECRET_KEY', 'nexaflow-super-secret-key-12345')
    )

config = get_config()
