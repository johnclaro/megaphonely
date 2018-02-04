from django.db import models
from django.conf import settings

from src.social import managers


class Social(models.Model):
    id = models.BigIntegerField(primary_key=True)
    username = models.CharField(max_length=100)
    fullname = models.CharField(max_length=100)
    picture_url = models.URLField()
    access_token_key = models.TextField(max_length=1000)

    accounts = models.ManyToManyField(settings.AUTH_USER_MODEL)

    class Meta:
        abstract = True

    def __str__(self):
        return self.username


class Twitter(Social):
    access_token_secret = models.TextField()
    objects = managers.Twitter()


class Facebook(Social):
    objects = managers.Facebook()


class Profile(models.Model):
    account = models.OneToOneField(settings.AUTH_USER_MODEL,
                                   on_delete=models.CASCADE)
