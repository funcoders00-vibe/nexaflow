from dataclasses import dataclass
import os
from dotenv import load_dotenv
load_dotenv()

@dataclass
class Config:
    db_port: str
    db_host: str
    db_name: str
    db_username: str
    db_password: str
    port: int
    host: str
    log_level: str

def get_config():
    return Config(
        db_port=os.getenv('DB_PORT'),
        db_host=os.getenv('DB_HOST'),
        db_name=os.getenv('DB_NAME'),
        db_username=os.getenv('DB_USERNAME',),
        db_password=os.getenv('DB_PASSWORD'),
        port=int(os.getenv('PORT')),
        host=os.getenv('HOST'),
        log_level=os.getenv('LOG_LEVEL')
    )

config = get_config()
