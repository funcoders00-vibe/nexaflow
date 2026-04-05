from sqlalchemy.orm import Session
from src.repositories.database import Database
from src.repositories.schemas import  Admin
 

class Seeder:

    def __init__(self):
        self.db = Database()

    def seed_data(self):

        session = Session(self.db.engine)

        try:
            if not session.query(Admin).first():

                admin = [
                    Admin(email="viswa3104@company.com", password="viswa",is_active=True),
                    Admin(email="tamil3104@company.com", password="tamil",is_active=True)
                ]

                session.add_all(admin)

            session.commit()

        except Exception as e:
            session.rollback()
            raise e

        finally:
            session.close()