from django.db import models
from django.conf import settings

from src.accounts.managers import SocialManager


class Profile(models.Model):
    account = models.OneToOneField(settings.AUTH_USER_MODEL,
                                   on_delete=models.CASCADE)


class Company(models.Model):
    account = models.ForeignKey(settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE)


class Social(models.Model):
    social_id = models.BigIntegerField()
    provider = models.CharField(max_length=30)
    username = models.CharField(max_length=100)
    fullname = models.CharField(max_length=100, blank=True)
    picture_url = models.URLField(blank=True)
    access_token_key = models.TextField(max_length=1000)
    access_token_secret = models.TextField(blank=True)

    companies = models.ManyToManyField(Company)

    objects = SocialManager()

    class Meta:
        unique_together = ('social_id', 'provider',)

    def __str__(self):
        return self.username
