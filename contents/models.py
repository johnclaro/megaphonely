from django.db import models


class Content(models.Model):
    message = models.TextField()
    publisher = models.ForeignKey(
        'auth.User', related_name='contents', on_delete=models.CASCADE
    )
