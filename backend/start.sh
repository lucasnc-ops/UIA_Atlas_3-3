#!/bin/bash

# Exit on error
set -e

# Run migrations (skip if SKIP_MIGRATIONS=true)
if [ "$SKIP_MIGRATIONS" != "true" ]; then
  echo "Running migrations..."
  alembic upgrade head || echo "Migration failed, continuing anyway..."
fi

# Start the application
exec gunicorn -c gunicorn_conf.py app.main:app
