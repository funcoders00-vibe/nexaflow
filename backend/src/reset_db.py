from src.repositories.database import Database
from src.repositories.schemas import Base
from src.migrations.migrations import Migration
from src.migrations.seeders import Seeder

def reset():
    db = Database()
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=db.engine)
    print("Creating all tables...")
    mig = Migration()
    mig.create_tables()
    print("Seeding database...")
    seed = Seeder()
    seed.seed_data()
    print("Database reset complete!")

if __name__ == "__main__":
    reset()
