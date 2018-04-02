from django.db.models import (OneToOneField, FileField, CASCADE, Model,
                              BooleanField)
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.models import AbstractUser

from allauth.account.models import EmailAddress
from allauth.account.signals import email_confirmed

from megaphonely.accounts.managers import ProfileManager


class User(AbstractUser):
    pass


class Profile(Model):
    account = OneToOneField(settings.AUTH_USER_MODEL, on_delete=CASCADE)
    picture = FileField(upload_to='profiles', blank=True, null=True)
    newsletter = BooleanField(default=True)

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


@receiver(email_confirmed)
def update_user_email(sender, request, email_address, **kwargs):
    # Once the email address is confirmed, make new email_address primary.
    # This also sets user.email to the new email address.
    # email_address is an instance of allauth.account.models.EmailAddress
    email_address.set_as_primary()
    # Get rid of old email addresses
    stale_addresses = EmailAddress.objects.filter(
        user=email_address.user
    ).exclude(primary=True).delete()
