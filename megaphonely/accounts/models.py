from django.db import models
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save

import stripe
from allauth.account.models import EmailAddress
from allauth.account.signals import email_confirmed

from megaphonely.accounts.managers import ProfileManager


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