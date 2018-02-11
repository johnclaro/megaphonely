from django.db import models
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save

from megaphonely.accounts.managers import ProfileManager


class Profile(models.Model):
    account = models.OneToOneField(settings.AUTH_USER_MODEL,
                                   on_delete=models.CASCADE)

    objects = ProfileManager()

    def __str__(self):
        return self.account.username

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(account=instance)

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def save_user_profile(sender, instance, **kwargs):
        instance.profile.save()
