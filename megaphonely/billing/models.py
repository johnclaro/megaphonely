from django.db.models import (Model, OneToOneField, CharField, CASCADE)
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save

import stripe

from .managers import CustomerManager


class Customer(Model):
    account = OneToOneField(settings.AUTH_USER_MODEL, on_delete=CASCADE)
    customer_id = CharField(max_length=100, null=True)

    objects = CustomerManager()

    def __str__(self):
        return self.customer_id

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_customer(sender, instance, created, **kwargs):
        if created:
            customer = stripe.Customer.create(email=instance.email)
            Customer.objects.create(
                account=instance, customer_id=customer['id']
            )

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def save_customer(sender, instance, **kwargs):
        instance.profile.save()
