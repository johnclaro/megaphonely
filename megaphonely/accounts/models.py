from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.db import models
from django.contrib.auth.models import AbstractUser

import stripe

from .managers import ProfileManager


class MyUser(AbstractUser):
    pass


class Profile(models.Model):
    account = models.OneToOneField(settings.AUTH_USER_MODEL,
                                   on_delete=models.CASCADE)
    stripe_id = models.CharField(max_length=100, null=True)
    picture = models.FileField(upload_to='uploads', blank=True, null=True)

    objects = ProfileManager()

    def __str__(self):
        return self.account.username

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_user_profile(sender, instance, created, **kwargs):
        if created:
            customer = stripe.Customer.create(email=instance.email)
            Profile.objects.create(account=instance, stripe_id=customer['id'])

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def save_user_profile(sender, instance, **kwargs):
        instance.profile.save()
