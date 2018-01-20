from allauth.socialaccount.models import SocialAccount

from django.db import models


class Profile(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE)
    social = models.ManyToManyField(SocialAccount)
