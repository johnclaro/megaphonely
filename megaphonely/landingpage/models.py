from django.db import models

from .choices import KINDS, CATEGORIES


class Charlie(models.Model):
    email = models.EmailField(unique=True)
    kind = models.CharField(max_length=10, choices=KINDS)
    category = models.CharField(max_length=100, choices=CATEGORIES)

    def __str__(self):
        return self.email
