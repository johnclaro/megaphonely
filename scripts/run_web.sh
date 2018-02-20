#!/bin/sh

python3 manage.py migrate
python3 manage.py collectstatic --noinput

# Start Gunicorn processes
echo Starting Gunicorn.
exec gunicorn megaphonely.wsgi:application --bind 0.0.0.0:8000 --workers 4