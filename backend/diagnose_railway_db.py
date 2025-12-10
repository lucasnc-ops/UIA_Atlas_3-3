#!/usr/bin/env python3
"""
Railway-specific database diagnostic script
Run this on Railway shell to diagnose database connection issues
"""
import os
import sys

def diagnose():
    print("=" * 60)
    print("RAILWAY DATABASE DIAGNOSTICS")
    print("=" * 60)
    print()

    # Check environment variables
    print("1. Environment Variables")
    db_url = os.getenv("DATABASE_URL", "NOT SET")
    if db_url != "NOT SET":
        # Mask password
        if "@" in db_url:
            parts = db_url.split("@")
            user_pass = parts[0].split("://")[1]
            if ":" in user_pass:
                user = user_pass.split(":")[0]
                masked = db_url.replace(user_pass, f"{user}:****")
                print(f"   DATABASE_URL: {masked}")
            else:
                print(f"   DATABASE_URL: {db_url[:50]}...")
        else:
            print(f"   DATABASE_URL: {db_url[:50]}...")
    else:
        print("   DATABASE_URL: NOT SET")
        print("   ERROR: Database URL not configured!")
        return False
    print()

    # Try to import and connect
    print("2. Testing Database Connection")
    try:
        from sqlalchemy import create_engine, text
        from sqlalchemy.exc import OperationalError

        print("   Creating engine...")
        engine = create_engine(db_url, pool_pre_ping=True)

        print("   Attempting connection...")
        with engine.connect() as conn:
            print("   SUCCESS: Connected to database!")

            # Get PostgreSQL version
            result = conn.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"   PostgreSQL: {version[:60]}...")

            # Check for tables
            result = conn.execute(text("""
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                ORDER BY table_name
            """))
            tables = [row[0] for row in result]

            print()
            print("3. Database Tables")
            if not tables:
                print("   WARNING: No tables found!")
                print("   ACTION: Run 'alembic upgrade head' to create tables")
                return False
            else:
                print(f"   Found {len(tables)} tables:")
                for table in tables:
                    print(f"      - {table}")

            # Check projects count
            if 'projects' in tables:
                print()
                print("4. Project Data")
                result = conn.execute(text("SELECT COUNT(*) FROM projects"))
                count = result.fetchone()[0]
                print(f"   Total projects: {count}")

                if count == 0:
                    print("   WARNING: No projects in database!")
                    print("   ACTION: Import data with import_full_dataset.py")
                else:
                    # Get sample
                    result = conn.execute(text("""
                        SELECT project_name, city, workflow_status
                        FROM projects
                        LIMIT 3
                    """))
                    print("   Sample projects:")
                    for row in result:
                        print(f"      - {row[0][:40]} ({row[1]}, {row[2]})")

            print()
            print("=" * 60)
            print("RESULT: Database connection and schema OK!")
            print("=" * 60)
            return True

    except OperationalError as e:
        print(f"   ERROR: Connection failed!")
        print(f"   {str(e)}")
        print()
        print("=" * 60)
        print("TROUBLESHOOTING")
        print("=" * 60)
        print()
        print("1. Check if Supabase project is paused")
        print("   Go to: https://supabase.com/dashboard")
        print("   Find project: jbvwocpvpqwrwglpverj")
        print("   Restore if paused")
        print()
        print("2. Verify DATABASE_URL in Railway settings")
        print("   Format: postgresql://user:pass@host:5432/dbname")
        print()
        print("3. Check if database accepts connections")
        print("   Verify Supabase network settings")
        return False
    except ImportError as e:
        print(f"   ERROR: Required package not installed: {e}")
        print("   Run: pip install sqlalchemy psycopg2-binary")
        return False
    except Exception as e:
        print(f"   ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    success = diagnose()
    sys.exit(0 if success else 1)
