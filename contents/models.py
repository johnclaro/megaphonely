from django.db import models

from accounts.models import Social


class Content(models.Model):
    message = models.TextField()

    user = models.ForeignKey(
        'auth.User', related_name='contents', on_delete=models.CASCADE
    )
    socials = models.ManyToManyField(Social)