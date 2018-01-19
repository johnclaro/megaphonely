from allauth.socialaccount.models import SocialAccount

from django.db import models


class Content(models.Model):
    message = models.TextField()
    user = models.ForeignKey(
        'auth.User', related_name='contents', on_delete=models.CASCADE
    )
    social_accounts = models.ManyToManyField(
        SocialAccount, related_name='social_accounts'
    )