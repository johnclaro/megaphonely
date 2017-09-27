# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from datetime import datetime

from django.db import models
from django.utils.timezone import now


class Content(models.Model):
    text = models.CharField(max_length=63206)
    publish_date = models.DateTimeField(default=now(), blank=True)
    twitter = models.BooleanField()
    facebook = models.BooleanField()
    instagram = models.BooleanField()
    image = models.ImageField()
