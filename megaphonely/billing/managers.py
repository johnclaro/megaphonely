from datetime import timedelta

from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.utils import timezone

import stripe


class PlanManager(models.Manager):

    def get_plan_by_name(self, name):
        return self.get(name=name)


class CustomerManager(models.Manager):

    def create_stripe_customer(self, user):
        try:
            stripe_customer = stripe.Customer.retrieve(
                user.customer.stripe_customer_id
            )
        except ObjectDoesNotExist:
            stripe_customer = stripe.Customer.create(email=user.email)
            self.create(stripe_customer_id=stripe_customer['id'], account=user)

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
                            customer, plan):
        return self.create(
            stripe_subscription_id=stripe_subscription_id,
            payment_method=payment_method,
            customer=customer,
            ends_at=timezone.now() + timedelta(days=31),
            is_active=True,
            plan=plan
        )

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
        subscription = self.get_subscription_by_customer(customer)
        stripe_subscription_id = subscription.stripe_subscription_id
        stripe_subscription = stripe.Subscription.retrieve(
            stripe_subscription_id)
        current_subscription_id = stripe_subscription['items']['data'][0].id
        items = [{'id': current_subscription_id, 'plan': plan.name}]
        stripe.Subscription.modify(
            stripe_subscription_id, cancel_at_period_end=False, items=items
        )
        subscription.plan = plan
        subscription.is_active = True
        subscription.save()

        return subscription

    def create_stripe_subscription(self, plan_name, stripe_customer):
        stripe_subscription = stripe.Subscription.create(
            customer=stripe_customer['id'], items=[{'plan': plan_name}]
        )

        return stripe_subscription

    def reactivate_stripe_subscription(self, customer):
        subscription = self.get_subscription_by_customer(customer)
        stripe_subscription = stripe.Subscription.modify(
            subscription.stripe_subscription_id, cancel_at_period_end=False
        )
        subscription.is_active = True
        subscription.save()

        return stripe_subscription
