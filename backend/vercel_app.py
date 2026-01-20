"""
Vercel serverless function entry point for Atlas 3+3 backend
This wrapper ensures FastAPI works correctly in Vercel's serverless environment
"""
import sys
import os

# Ensure the app directory is in the Python path
sys.path.insert(0, os.path.dirname(__file__))

try:
    from app.main import app
    
    # Export for Vercel
    handler = app
    
except Exception as e:
    # If import fails, create a minimal error handler
    print(f"ERROR: Failed to import app: {e}", file=sys.stderr)
    import traceback
    traceback.print_exc()
    
    # Create a minimal FastAPI app that shows the error
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse
    
    handler = FastAPI()
    
    @handler.get("/{path:path}")
    async def error_handler(path: str):
        return JSONResponse(
            status_code=500,
            content={
                "error": "Application failed to start",
                "message": str(e),
                "path": path
            }
        )
