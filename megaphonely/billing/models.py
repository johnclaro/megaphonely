from datetime import timedelta

from django.db.models import (Model, OneToOneField, CharField, CASCADE,
                              DateTimeField, BooleanField)
from django.utils import timezone
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save

from .managers import CustomerManager, TrialManager
from .choices import PLANS


def get_trial_ends_at():
    return timezone.now() + timedelta(days=7)


class Customer(Model):
    account = OneToOneField(settings.AUTH_USER_MODEL, on_delete=CASCADE)
    customer_id = CharField(max_length=50)
    plan = CharField(max_length=20, choices=PLANS, default='trial')
    subscription_id = CharField(max_length=50)
    last_four = CharField(max_length=4)
    card = CharField(max_length=20)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    objects = CustomerManager()

    def __str__(self):
        return f'{self.account}-{self.customer_id}'


class Trial(Model):
    account = OneToOneField(settings.AUTH_USER_MODEL, on_delete=CASCADE)
    ends_at = DateTimeField(default=get_trial_ends_at)
    active = BooleanField(default=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    objects = TrialManager()

    def __str__(self):
        return self.account.username

    def get_ends_at_date(self):
        return self.ends_at.date()

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_trial(sender, instance, created, **kwargs):
        if created:
            Trial.objects.create(account=instance)

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def save_trial(sender, instance, **kwargs):
        instance.trial.save()