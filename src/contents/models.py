from django.db import models
from django.conf import settings


class ContentManager(models.Manager):
    pass


class Content(models.Model):
    message = models.TextField()
    schedule_at = models.DateTimeField()

    account = models.ForeignKey(settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE)

    objects = ContentManager()

    def __str__(self):
        return self.message
