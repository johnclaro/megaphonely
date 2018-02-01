from django.db import models
from django.conf import settings


class Content(models.Model):
    message = models.TextField()

    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             related_name='contents',
                             on_delete=models.CASCADE)
