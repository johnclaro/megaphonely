from datetime import timedelta

from django.db.models import (Model, OneToOneField, CharField, CASCADE,
                              DateTimeField)
from django.utils import timezone
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save

from .managers import CustomerManager
from .choices import PLANS


def get_trial_ends_at():
    return timezone.now() + timedelta(days=7)


class Customer(Model):
    account = OneToOneField(settings.AUTH_USER_MODEL, on_delete=CASCADE)
    customer_id = CharField(max_length=50, blank=True)
    plan = CharField(max_length=20, choices=PLANS, default='trial')
    subscription_id = CharField(max_length=50, blank=True)
    last_four = CharField(max_length=4, blank=True)
    card = CharField(max_length=20, blank=True)
    ends_at = DateTimeField(default=get_trial_ends_at)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    objects = CustomerManager()

    def __str__(self):
        return f'{self.account}-{self.customer_id}'

    def get_ends_at_date(self):
        return self.ends_at.date()

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_customer(sender, instance, created, **kwargs):
        if created:
            Customer.objects.create(account=instance)

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def save_customer(sender, instance, **kwargs):
        instance.customer.save()
