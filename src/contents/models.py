from django.db import models


class ContentManager(models.Manager):
    pass


class Content(models.Model):
    message = models.TextField()
    schedule_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    company = models.ForeignKey('accounts.Company',
                                on_delete=models.CASCADE,
                                blank=True)

    objects = ContentManager()

    def __str__(self):
        return self.message
