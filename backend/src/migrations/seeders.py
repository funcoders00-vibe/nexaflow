from sqlalchemy.orm import Session
from src.repositories.database import Database
from src.repositories.schemas import Admin
from passlib.hash import pbkdf2_sha256
from datetime import datetime, timedelta

class Seeder:

    def __init__(self):
        self.db = Database()

    def seed_data(self):
        session = Session(self.db.engine)
        try:
            # 1. Seed Employees / System Users
            if not session.query(Admin).first():
                employees = [
                    Admin(
                        email="viswa3104@gmail.com",
                        password=pbkdf2_sha256.hash("viswa"),
                        name="Viswanathan",
                        role="Admin",
                        salary=150000.0,
                        productivity_score=98.0,
                        is_active=True
                    ),
                    Admin(
                        email="jeevadarshan71@gmail.com",
                        password=pbkdf2_sha256.hash("jeeva"),
                        name="Jeeva dharshan",
                        role="Admin",
                        salary=150000.0,
                        productivity_score=98.0,
                        is_active=True
                    ),
                ]
                session.add_all(employees)
                session.commit()
                print("[Seeder] Employee accounts ready.")
            else:
                print("[Seeder] Employees already exist — skipping.")

        except Exception as e:
            session.rollback()
            raise e
        finally:
            session.close()