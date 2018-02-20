#!/bin/sh

sleep 10
celery -A megaphonely worker --loglevel=info --beat