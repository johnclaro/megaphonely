from datetime import timedelta

from django.db import models
from django.utils import timezone
from django.conf import settings
from django.dispatch import receiver
from django.db.models.signals import post_save

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

    class Meta:
        db_table = 'plans'

    def __str__(self):
        return self.pk


class Customer(models.Model):
    stripe_customer_id = models.CharField(max_length=100, primary_key=True)
    account = models.OneToOneField(settings.AUTH_USER_MODEL,
                                   on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = CustomerManager()

    class Meta:
        db_table = 'customers'

    def __str__(self):
        return self.stripe_customer_id

    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_user_customer(sender, instance, created, **kwargs):
        if created:
            stripe_customer = Customer.objects.create_stripe_customer(instance)
            stripe_customer_id = stripe_customer['id']
            stripe_subscription = Subscription.objects.create_stripe_subscription(
                'free', stripe_customer_id
            )
            stripe_subscription_id = stripe_subscription['id']
            customer = Customer.objects.create_customer(
                stripe_customer_id, instance
            )
            plan = Plan.objects.get_plan('free')
            Subscription.objects.create_subscription(
                stripe_subscription_id, customer, plan
            )


class PaymentMethod(models.Model):
    stripe_source_id = models.CharField(max_length=100, primary_key=True)
    stripe_last_four = models.CharField(max_length=4)
    stripe_brand = models.CharField(max_length=20)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = PaymentMethodManager()

    class Meta:
        db_table = 'payment_methods'

    def __str__(self):
        return self.stripe_source_id


class Subscription(models.Model):
    stripe_subscription_id = models.CharField(max_length=100, primary_key=True)
    is_active = models.BooleanField(default=False)
    ends_at = models.DateTimeField(default=get_trial_ends_at)
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.CASCADE,
                                       blank=True, null=True)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    customer = models.OneToOneField(Customer, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = SubscriptionManager()

    class Meta:
        db_table = 'subscriptions'

    def __str__(self):
        return self.stripe_subscription_id
