from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings

# Create database engine
connect_args = {}
engine_args = {
    "pool_pre_ping": True,
}

if "sqlite" in settings.DATABASE_URL:
    connect_args = {"check_same_thread": False}
    # SQLite doesn't support pool_size/max_overflow with the default pool
else:
    engine_args["pool_size"] = 10
    engine_args["max_overflow"] = 20

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    **engine_args
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db():
    """Dependency for database sessions"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
