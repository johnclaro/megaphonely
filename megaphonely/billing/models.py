from datetime import timedelta

from django.db import models
from django.utils import timezone
from django.conf import settings

from .managers import (CustomerManager, SubscriptionManager,
                       PaymentMethodManager, PlanManager)
from .choices import PLANS


def get_trial_ends_at():
    return timezone.now() + timedelta(days=7)


class Plan(models.Model):
    name = models.CharField(max_length=20, choices=PLANS, primary_key=True)
    price = models.IntegerField()
    socials = models.IntegerField()
    contents = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = PlanManager()

    def __str__(self):
        return self.pk


class Customer(models.Model):
    stripe_customer_id = models.CharField(max_length=100, primary_key=True)
    account = models.OneToOneField(settings.AUTH_USER_MODEL,
                                   on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = CustomerManager()

    def __str__(self):
        return self.stripe_customer_id


class PaymentMethod(models.Model):
    stripe_source_id = models.CharField(max_length=100, primary_key=True)
    stripe_last_four = models.CharField(max_length=4)
    stripe_brand = models.CharField(max_length=20)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = PaymentMethodManager()

    def __str__(self):
        return self.stripe_source_id


class Subscription(models.Model):
    stripe_subscription_id = models.CharField(max_length=100, primary_key=True)
    ends_at = models.DateTimeField(default=get_trial_ends_at)
    is_active = models.BooleanField(default=False)
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.CASCADE)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    customer = models.OneToOneField(Customer, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = SubscriptionManager()

    def __str__(self):
        return self.stripe_subscription_id
