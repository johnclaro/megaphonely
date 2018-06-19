from datetime import timedelta

from django.db import models
from django.conf import settings
from django.utils import timezone

import stripe


class CustomerManager(models.Manager):

    def upsert(self, user, plan, stripe_token):
        plan_id = settings.STRIPE_PLANS[plan]['id']

        stripe_customer = stripe.Customer.create(email=user.email)
        customer = self.create(
            account=user, customer_id=stripe_customer['id'], plan='trial'
        )
        source = stripe_customer.sources.create(source=stripe_token)
        subscription = stripe.Subscription.create(
            customer=stripe_customer['id'], items=[{'plan': plan_id}]
        )
        customer.subscription_id = subscription['id']

        customer.plan = plan
        customer.source = source['id']
        customer.card = source['brand']
        customer.last_four = source['last4']
        customer.ends_at = timezone.now() + timedelta(days=31)
        customer.save()

        return customer
