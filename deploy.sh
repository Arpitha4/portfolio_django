#!/bin/bash

echo "Starting deployment..."

# Apply migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Start Gunicorn
gunicorn portfolio_site.wsgi:application --bind 0.0.0.0:$PORT
