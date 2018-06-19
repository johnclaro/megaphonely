from django.db import models
from django.conf import settings

import stripe


class CustomerManager(models.Manager):

    def create_stripe_customer(self, user):
        stripe_customer = stripe.Customer.create(email=user.email)
        customer = self.get(account=user)

        return customer, stripe_customer


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

    def get_subscription(self, customer):
        return self.get(customer=customer)

    def create_stripe_subscription(self, plan, payment_method, customer,
                            stripe_customer):
        plan_id = settings.STRIPE_PLANS[plan]['id']
        stripe_subscription = stripe.Subscription.create(
            customer=stripe_customer['id'], items=[{'plan': plan_id}]
        )
        subscription = self.create(
            stripe_subscription_id=stripe_subscription['id'],
            payment_method=payment_method, customer=customer
        )

        return subscription



