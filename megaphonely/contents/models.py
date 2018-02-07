from django.db import models
from django.conf import settings
from django.utils import timezone


class ContentManager(models.Manager):
    pass


class Content(models.Model):
    message = models.TextField()
    schedule_at = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    account = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )

    objects = ContentManager()

    def __str__(self):
        return self.message
