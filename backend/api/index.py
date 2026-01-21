"""
Vercel serverless entry point for Atlas 3+3 FastAPI backend
"""
import sys
import os
from pathlib import Path

# Add parent directory to path so we can import app
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

# Import Mangum and FastAPI app
from mangum import Mangum

try:
    from app.main import app
    # Wrap with Mangum for Vercel serverless
    handler = Mangum(app, lifespan="off")
except Exception as e:
    print(f"ERROR loading app: {e}", file=sys.stderr)
    import traceback
    traceback.print_exc()
    
    # Return error response
    def handler(event, context):
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": f'{{"error": "Failed to load application", "message": "{str(e)}"}}'
        }
