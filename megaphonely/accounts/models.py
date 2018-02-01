from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser

from megaphonely.accounts import managers


class User(AbstractUser):
    pass


class Social(models.Model):
    id = models.BigIntegerField(primary_key=True)
    username = models.CharField(max_length=100)
    fullname = models.CharField(max_length=100)
    picture_url = models.URLField()
    access_token_key = models.TextField(max_length=1000)

    users = models.ManyToManyField(settings.AUTH_USER_MODEL)

    class Meta:
        abstract = True

    def __str__(self):
        return self.username


class Twitter(Social):
    access_token_secret = models.TextField()
    objects = managers.TwitterManager()


class Facebook(Social):
    objects = managers.FacebookManager()


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE)
