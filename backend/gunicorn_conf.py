import multiprocessing
import os

# Gunicorn config variables
workers = multiprocessing.cpu_count() * 2 + 1
port = os.environ.get("PORT", "8000")
bind = f"0.0.0.0:{port}"
keepalive = 120
errorlog = "-"
accesslog = "-"
worker_class = "uvicorn.workers.UvicornWorker"
timeout = 120
max_requests = 1000
max_requests_jitter = 50
