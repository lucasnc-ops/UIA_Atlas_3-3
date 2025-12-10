#!/bin/bash

# Exit on error
set -e

# Run migrations
alembic upgrade head

# Import initial data
python import_full_dataset.py

# Start the application
exec gunicorn -c gunicorn_conf.py app.main:app
