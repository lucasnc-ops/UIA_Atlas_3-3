"""
Minimal diagnostic endpoint for Vercel debugging
"""
from http.server import BaseHTTPRequestHandler
import json
import os
import sys

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

        # Check environment variables
        env_vars = {
            'DATABASE_URL': 'SET' if os.getenv('DATABASE_URL') else 'NOT SET',
            'SECRET_KEY': 'SET' if os.getenv('SECRET_KEY') else 'NOT SET',
            'CORS_ORIGINS': os.getenv('CORS_ORIGINS', 'NOT SET'),
            'PYTHON_VERSION': sys.version,
            'PATH': self.path
        }

        response = {
            "status": "diagnostic",
            "message": "Backend is responding!",
            "env_check": env_vars
        }

        self.wfile.write(json.dumps(response, indent=2).encode())
        return

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()
