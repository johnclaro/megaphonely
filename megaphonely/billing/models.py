from datetime import timedelta

from django.db import models
from django.utils import timezone
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save

from .managers import CustomerManager, SubscriptionManager, PaymentMethodManager
from .choices import PLANS


def get_trial_ends_at():
    return timezone.now() + timedelta(days=7)


class Customer(models.Model):
    stripe_customer_id = models.CharField(max_length=100, primary_key=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    account = models.OneToOneField(settings.AUTH_USER_MODEL,
                                   on_delete=models.CASCADE)

    objects = CustomerManager()

    def __str__(self):
        return self.stripe_customer_id

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_customer(sender, instance, created, **kwargs):
        if created:
            Customer.objects.create(account=instance)

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def save_customer(sender, instance, **kwargs):
        instance.customer.save()


class PaymentMethod(models.Model):
    stripe_source_id = models.CharField(max_length=100, primary_key=True)
    stripe_last_four = models.CharField(max_length=4)
    stripe_brand = models.CharField(max_length=20)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = PaymentMethodManager()

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)

    def __str__(self):
        return self.stripe_source_id


class Subscription(models.Model):
    stripe_subscription_id = models.CharField(max_length=100, primary_key=True)
    plan = models.CharField(max_length=20, choices=PLANS, default='free')
    ends_at = models.DateTimeField(default=get_trial_ends_at)
    is_active = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = SubscriptionManager()

    customer = models.OneToOneField(Customer, on_delete=models.CASCADE)
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.CASCADE)

    def __str__(self):
        return self.stripe_subscription_id
