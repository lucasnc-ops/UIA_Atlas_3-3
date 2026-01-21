"""
Vercel serverless function entry point for Atlas 3+3 backend
Uses Mangum to adapt FastAPI for serverless environment
"""
import sys
import os

# Ensure the app directory is in the Python path
sys.path.insert(0, os.path.dirname(__file__))

try:
    from mangum import Mangum
    from app.main import app
    
    # Wrap FastAPI with Mangum for serverless compatibility
    handler = Mangum(app, lifespan="off")
    
except Exception as e:
    # If import fails, create a minimal error handler
    print(f"ERROR: Failed to import app: {e}", file=sys.stderr)
    import traceback
    traceback.print_exc()
    
    # Create a minimal error response
    def handler(event, context):
        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": f'{{"error": "Application failed to start", "message": "{str(e)}"}}'
        }
