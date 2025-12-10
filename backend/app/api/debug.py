"""
Temporary debug endpoints for diagnosing database connection issues
DELETE THIS FILE after fixing the database connection!
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text, inspect
from ..core.database import get_db, engine
from ..core.config import settings
import traceback

router = APIRouter()


@router.get("/db-status")
async def debug_database_status():
    """
    Debug endpoint to check database connection status
    WARNING: Remove this endpoint in production!
    """

    result = {
        "database_url_configured": bool(settings.DATABASE_URL),
        "database_host": settings.DATABASE_URL.split("@")[1].split("/")[0] if "@" in settings.DATABASE_URL else "unknown",
        "connection_test": None,
        "tables": [],
        "projects_count": None,
        "error": None
    }

    try:
        # Test basic connection
        with engine.connect() as conn:
            result["connection_test"] = "SUCCESS"

            # Get PostgreSQL version
            version_result = conn.execute(text("SELECT version()"))
            version = version_result.fetchone()[0]
            result["postgres_version"] = version[:100]

            # Check tables
            inspector = inspect(engine)
            result["tables"] = inspector.get_table_names()

            # Check migration version
            if 'alembic_version' in result["tables"]:
                migration_result = conn.execute(text("SELECT version_num FROM alembic_version"))
                migration_row = migration_result.fetchone()
                result["migration_version"] = migration_row[0] if migration_row else None

            # Count projects
            if 'projects' in result["tables"]:
                count_result = conn.execute(text("SELECT COUNT(*) FROM projects"))
                result["projects_count"] = count_result.fetchone()[0]

                # Get sample project
                sample_result = conn.execute(text("""
                    SELECT project_name, city, workflow_status
                    FROM projects
                    LIMIT 1
                """))
                sample = sample_result.fetchone()
                if sample:
                    result["sample_project"] = {
                        "name": sample[0],
                        "city": sample[1],
                        "status": sample[2]
                    }

            conn.commit()

    except Exception as e:
        result["connection_test"] = "FAILED"
        result["error"] = str(e)
        result["error_type"] = type(e).__name__
        result["traceback"] = traceback.format_exc()

    return result


@router.get("/db-test-query")
async def debug_test_query(db: Session = Depends(get_db)):
    """
    Test a simple database query using the session dependency
    WARNING: Remove this endpoint in production!
    """
    try:
        # Try to execute a simple query
        result = db.execute(text("SELECT 1 as test"))
        row = result.fetchone()

        return {
            "status": "SUCCESS",
            "query_result": row[0] if row else None,
            "message": "Database session works correctly"
        }
    except Exception as e:
        return {
            "status": "FAILED",
            "error": str(e),
            "error_type": type(e).__name__,
            "traceback": traceback.format_exc()
        }


@router.get("/env-check")
async def debug_environment():
    """
    Check environment configuration (without exposing secrets)
    WARNING: Remove this endpoint in production!
    """
    db_url = settings.DATABASE_URL

    # Parse connection string safely
    db_info = {
        "has_database_url": bool(db_url),
        "url_length": len(db_url) if db_url else 0,
    }

    if db_url:
        try:
            # Extract info without exposing password
            if "://" in db_url:
                protocol = db_url.split("://")[0]
                rest = db_url.split("://")[1]

                db_info["protocol"] = protocol

                if "@" in rest:
                    user_part = rest.split("@")[0]
                    host_part = rest.split("@")[1]

                    if ":" in user_part:
                        db_info["username"] = user_part.split(":")[0]
                        db_info["has_password"] = True

                    if "/" in host_part:
                        host_and_port = host_part.split("/")[0]
                        db_info["database"] = host_part.split("/")[1].split("?")[0]

                        if ":" in host_and_port:
                            db_info["host"] = host_and_port.split(":")[0]
                            db_info["port"] = host_and_port.split(":")[1]
                        else:
                            db_info["host"] = host_and_port
        except Exception as e:
            db_info["parse_error"] = str(e)

    return {
        "environment": settings.ENVIRONMENT,
        "database": db_info,
        "frontend_url": settings.FRONTEND_URL,
        "cors_origins_count": len(settings.cors_origins_list)
    }

@router.post("/trigger-import")
async def trigger_import():
    """
    Manually trigger data import
    WARNING: Remove this endpoint in production!
    """
    try:
        # Import the script dynamically to avoid circular imports or issues if script is missing
        import sys
        import os
        
        # Add backend dir to path if needed
        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        if backend_dir not in sys.path:
            sys.path.append(backend_dir)
            
        from import_full_dataset import import_projects
        
        # Run import
        import_projects()
        
        return {"status": "SUCCESS", "message": "Data import completed"}
    except Exception as e:
        return {
            "status": "FAILED", 
            "error": str(e),
            "traceback": traceback.format_exc()
        }
