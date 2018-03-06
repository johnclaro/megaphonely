from django.db.models import (Model, OneToOneField, CharField, CASCADE,
                              DateTimeField)
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save

import stripe

from .managers import CustomerManager
from .choices import PLAN_CHOICES


class Customer(Model):
    account = OneToOneField(settings.AUTH_USER_MODEL, on_delete=CASCADE)
    customer_id = CharField(max_length=50, null=True)
    plan = CharField(max_length=20, choices=PLAN_CHOICES, default='free')
    subscription_id = CharField(max_length=50, null=True, blank=True)
    last_four = CharField(max_length=4, null=True, blank=True)
    brand = CharField(max_length=20, null=True, blank=True)
    next_payment_at = DateTimeField(blank=True, null=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    objects = CustomerManager()

    def __str__(self):
        return self.customer_id

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_customer(sender, instance, created, **kwargs):
        if created:
            customer = stripe.Customer.create(email=instance.email)
            Customer.objects.create(
                account=instance, customer_id=customer['id'], plan='standard'
            )
            stripe.Subscription.create(
                customer=customer['id'],
                items=[{
                    'plan': settings.STRIPE_PLANS['standard']['id']
                }],
                trial_period_days=7
            )

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def save_customer(sender, instance, **kwargs):
        instance.profile.save()
