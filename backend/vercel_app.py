"""
Vercel serverless function entry point for Atlas 3+3 backend
"""
from app.main import app

# Vercel will use this as the ASGI application
handler = app
