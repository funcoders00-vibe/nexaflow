from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker
from src.settings import config
from urllib.parse import quote_plus
 
 
class Database:
    _instance = None  
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance
 
    def _initialize(self):
        
 
        db_url = (
            config.DATABASE_URL
        )
 
        self.engine = create_engine(db_url, pool_pre_ping=True)
 
        self.SessionLocal = sessionmaker(
            bind=self.engine,
            autoflush=False,
            autocommit=False
        )
 
    def get_session(self):
        session = self.SessionLocal()
        try:
            yield session
        finally:
            session.close()
 
    def inspector(self):
        return inspect(self.engine)
 
    def test_connection(self):
        try:
            with self.engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            return True

        except Exception as e:
            print("DATABASE ERROR:")
            print(repr(e))
            return False
        