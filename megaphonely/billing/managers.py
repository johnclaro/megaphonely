from datetime import timedelta

from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.utils import timezone

import stripe


class PlanManager(models.Manager):

    def get_plan(self, name):
        try:
            print(f'Getting plan {name}...')
            plan = self.get(name=name)
            print(f'Got plan: {plan}')
        except ObjectDoesNotExist:
            plan = self.create(name='free', price=0, socials=3, contents=20)
            self.create(name='standard', price=19, socials=8, contents=200)
            self.create(name='premium', price=49, socials=20, contents=600)

        return plan


class CustomerManager(models.Manager):

    def get_customer(self, user):
        customer = self.get(account=user)

        return customer

    def create_customer(self, stripe_customer_id, user):
        print(f'Creating customer with stripe customer ID: {stripe_customer_id} and user: {user}...')
        customer = self.create(
            stripe_customer_id=stripe_customer_id, account=user
        )
        print(f'Saving {customer}...')
        customer.save()
        print(f'Saved customer: {customer}')

        return customer

    def get_stripe_customer(self, user):
        print(f'Getting stripe customer of user: {user}')
        stripe_customer = stripe.Customer.retrieve(
            user.customer.stripe_customer_id
        )
        print(f'Got stripe customer: {stripe_customer["id"]}')

        return stripe_customer

    def create_stripe_customer(self, user):
        print(f'Creating stripe customer for user: {user}...')
        stripe_customer = stripe.Customer.create(email=user.email)
        print(f'Created stripe customer: {stripe_customer}')

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

    def update_subscription(self, user, payment_method, plan):
        print(f'Getting subscription of user: {user}')
        subscription = user.customer.subscription
        print(f'Updating subscription {subscription} with payment method: {payment_method}')
        subscription.payment_method = payment_method
        subscription.ends_at = timezone.now() + timedelta(days=30)
        subscription.plan = plan
        subscription.save()
        print(f'Updated subscription: {subscription}')

        return subscription


    def create_subscription(self, stripe_subscription_id, customer, plan):
        print(f'Creating subscription with stripe subscription ID: {stripe_subscription_id}, customer: {customer}, plan: {plan} and payment method {payment_method}')
        subscription = self.create(
            stripe_subscription_id=stripe_subscription_id, customer=customer,
            is_active=True, plan=plan
        )
        print(f'Saving subscription: {stripe_subscription_id}...')
        subscription.save()
        print(f'Saved subscription: {stripe_subscription_id}')

        return subscription

    def get_subscription(self, customer):
        subscription = self.get(customer=customer)

        return subscription

    def cancel_stripe_subscription(self, customer, plan):
        subscription = self.get_subscription(customer)
        stripe_subscription_id = subscription.stripe_subscription_id
        stripe_subscription = stripe.Subscription.retrieve(
            stripe_subscription_id)
        stripe_subscription.delete(at_period_end=True)
        subscription.plan = plan
        subscription.is_active = False
        subscription.save()

        return subscription

    def prorotate_stripe_subscription(self, customer, plan):
        subscription = self.get_subscription(customer)
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

    def create_stripe_subscription(self, plan_name, stripe_customer_id):
        print(f'Creating stripe subscription with stripe_customer ID: {stripe_customer_id} and plan name: {plan_name}')
        stripe_subscription = stripe.Subscription.create(
            customer=stripe_customer_id, items=[{'plan': plan_name}]
        )
        print(f'Created stripe subscription: {stripe_subscription["id"]}')

        return stripe_subscription

    def reactivate_stripe_subscription(self, customer):
        subscription = self.get_subscription(customer)
        stripe_subscription = stripe.Subscription.modify(
            subscription.stripe_subscription_id, cancel_at_period_end=False
        )
        subscription.is_active = True
        subscription.save()

        return stripe_subscription
