from django.db import models
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import AbstractUser

from megaphonely.accounts.managers import ProfileManager


class User(AbstractUser):
    pass


class Profile(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    picture = models.FileField(upload_to='profiles', blank=True, null=True)
    newsletter = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    account = models.OneToOneField(settings.AUTH_USER_MODEL,
                                   on_delete=models.CASCADE)

    objects = ProfileManager()

    def __str__(self):
        return self.account.username

    def get_screen_name(self):
        if self.first_name and self.last_name:
            screen_name = f'{self.first_name} {self.last_name}'
        else:
            screen_name = self.account.username

        return screen_name

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            Profile.objects.create(account=instance)

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def save_user_profile(sender, instance, **kwargs):
        instance.profile.save()
