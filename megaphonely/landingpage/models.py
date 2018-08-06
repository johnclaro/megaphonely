from django.db import models

from .choices import KINDS, CATEGORIES
from .managers import CharlieManager


class Charlie(models.Model):
    email = models.EmailField(unique=True)
    kind = models.CharField(max_length=20, choices=KINDS)
    category = models.CharField(max_length=100, choices=CATEGORIES)
    objects = CharlieManager()

    def __str__(self):
        return self.email
