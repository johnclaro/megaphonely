from __future__ import absolute_import, unicode_literals
import os

from celery import Celery

RABBITMQ = 'amqp://admin:mypass@rabbit//'

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'megaphonely.settings')

app = Celery('megaphonely', broker=RABBITMQ)

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

app.conf.beat_schedule = {
    'load-scheduled-contents': {
        'task': 'megaphonely.dashboard.tasks.loader',
        'schedule': 60.0
    }
}
app.conf.timezone = 'UTC'
