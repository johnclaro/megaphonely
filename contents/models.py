from django.db import models


class Content(models.Model):
    message = models.TextField()

    user = models.ForeignKey(
        'auth.User', related_name='contents', on_delete=models.CASCADE
    )
