from datetime import timedelta

from django.db import models
from django.conf import settings
from django.utils import timezone

import stripe


class CustomerManager(models.Manager):

    def create_stripe_customer(self, user):
        stripe_customer_id = user.customer.stripe_customer_id
        if stripe_customer_id:
            stripe_customer = stripe.Customer.retrieve(stripe_customer_id)
        else:
            stripe_customer = stripe.Customer.create(email=user.email)
            user.customer.stripe_customer_id = stripe_customer['id']
            user.customer.save()

        return stripe_customer


class PaymentMethodManager(models.Manager):

    def create_stripe_payment_method(self, stripe_token, stripe_customer,
                                     customer):
        source = stripe_customer.sources.create(source=stripe_token)
        payment_method = self.create(
            stripe_source_id=source['id'], stripe_last_four=source['last4'],
            stripe_brand=source['brand'], customer=customer
        )

        return payment_method


class SubscriptionManager(models.Manager):

    def create_subscription(self, stripe_subscription_id, payment_method,
                            customer):
        subscription = self.create(
            stripe_subscription_id=stripe_subscription_id,
            payment_method=payment_method, customer=customer
        )

        return subscription

    def get_subscription_by_customer(self, customer):
        return self.get(customer=customer)

    def cancel_stripe_subscription(self, customer, plan):
        subscription = self.get_subscription_by_customer(customer)
        stripe_subscription_id = subscription.stripe_subscription_id
        stripe_subscription = stripe.Subscription.retrieve(
            stripe_subscription_id)
        stripe_subscription.delete(at_period_end=True)
        subscription.plan = plan
        subscription.is_active = False
        subscription.save()

        return subscription

    def prorotate_stripe_subscription(self, customer, plan):
        plan_id = settings.STRIPE_PLANS[plan]['id']
        subscription = self.get_subscription_by_customer(customer)
        stripe_subscription_id = subscription.stripe_subscription_id
        stripe_subscription = stripe.Subscription.retrieve(
            stripe_subscription_id)
        current_subscription_id = stripe_subscription['items']['data'][0].id
        items = [{'id': current_subscription_id, 'plan': plan_id}]
        stripe.Subscription.modify(
            stripe_subscription_id, cancel_at_period_end=False, items=items
        )
        subscription.plan = plan
        subscription.save()

        return subscription

    def create_stripe_subscription(self, plan, payment_method, customer,
                                   stripe_customer):
        plan_id = settings.STRIPE_PLANS[plan]['id']

        stripe_subscription = stripe.Subscription.create(
            customer=stripe_customer['id'], items=[{'plan': plan_id}]
        )
        subscription = self.create_subscription(
            stripe_subscription['id'], payment_method, customer
        )
        subscription.plan = plan
        subscription.ends_at = timezone.now() + timedelta(days=31)
        subscription.save()

        return subscription
