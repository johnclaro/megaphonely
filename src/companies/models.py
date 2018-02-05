from django.db import models
from django.conf import settings

class Company(models.Model):
    name = models.CharField(max_length=100)

    account = models.OneToOneField(settings.AUTH_USER_MODEL,
                                   on_delete=settings.AUTH_USER_MODEL)