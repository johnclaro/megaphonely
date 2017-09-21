# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db.models import (Model, CharField)


class Twitter(Model):
    text = CharField(max_length=140)


class Facebook(Model):
    text = CharField(max_length=63206)
