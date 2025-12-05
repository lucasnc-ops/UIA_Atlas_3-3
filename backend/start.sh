#!/bin/bash

# Exit on error
set -e

# Run migrations
alembic upgrade head

# Start the application
exec gunicorn -c gunicorn_conf.py app.main:app
