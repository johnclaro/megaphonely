from datetime import timedelta

from django.shortcuts import redirect
from django.conf import settings
from django.template import loader
from django.http import HttpResponse
from django.utils import timezone
from django.contrib import messages

import stripe

from .models import (Customer, Subscription, PaymentMethod)


def index(request):
    template = loader.get_template('billing/index.html')
    context = {}
    response = HttpResponse(template.render(context, request))
    return response


def subscribe(request, plan):
    template = loader.get_template('billing/plan.html')
    context = {'plan': plan, 'price': settings.STRIPE_PLANS[plan]['price']}
    response = HttpResponse(template.render(context, request))
    return response


def plan(request):
    plan = request.path.replace('/', '')
    price = settings.STRIPE_PLANS[plan]['price']

    template = loader.get_template('billing/plan.html')
    context = {'plan': plan, 'price': price}
    response = HttpResponse(template.render(context, request))

    return response


def upgrade(request):
    user = request.user
    payload = request.POST
    plan = payload['plan']
    stripe_token = payload['stripeToken']

    customer = Customer.objects.upsert(user, plan, stripe_token)
    print("Got customer:", customer)

    response = redirect('publisher:index')

    return response


def modify(request):
    user = request.user
    payload = request.POST
    plan = payload['plan']
    plan_id = settings.STRIPE_PLANS[plan]['id']

    subscription = Subscription.objects.get_subscription(user.customer)
    stripe_subscription_id = subscription.stripe_subscription_id
    stripe_subscription = stripe.Subscription.retrieve(stripe_subscription_id)
    current_subscription_id = stripe_subscription['items']['data'][0].id
    items = [{'id': current_subscription_id, 'plan': plan_id}]
    stripe.Subscription.modify(stripe_subscription_id, items=items)

    user.customer.plan = plan
    user.customer.ends_at = timezone.now() + timedelta(days=31)
    user.customer.save()

    messages.add_message(request, messages.SUCCESS, 'Successfully changed plan')
    response = redirect('publisher:index')

    return response


def change(request, plan):
    template = loader.get_template('billing/change.html')
    context = {'plan': plan, 'price': settings.STRIPE_PLANS[plan]['price']}
    response = HttpResponse(template.render(context, request))

    return response


def cancel(request):
    user = request.user

    subscription = stripe.Subscription.retrieve(user.customer.subscription_id)
    subscription.delete(at_period_end=True)
    user.customer.plan = 'trial'
    user.customer.ends_at = timezone.now() + timedelta(days=7)
    user.customer.save()
    response = redirect('publisher:index')

    return response


def pricing(request):
    user = request.user
    if not user.is_authenticated:
        template = loader.get_template('billing/pricing.html')
        context = {}
    else:
        template = loader.get_template('billing/upgrade.html')
        context = {'user': user}
        if user.customer.customer_id and user.customer.plan == 'trial':
            subscription_id = user.customer.subscription_id
            subscription = stripe.Subscription.retrieve(subscription_id)
            plan = subscription['items']['data'][0]['plan']['nickname']
            context['resume'] = plan
    response = HttpResponse(template.render(context, request))

    return response


def charge(request):
    user = request.user
    payload = request.POST
    plan = payload['plan']
    stripe_token = payload['stripeToken']

    customer, stripe_customer = Customer.objects.create_stripe_customer(user)
    payment_method = PaymentMethod.objects.create_stripe_payment_method(
        stripe_token, stripe_customer, customer
    )
    Subscription.objects.create_stripe_subscription(
        plan, payment_method, customer, stripe_customer
    )
    customer.stripe_customer_id = stripe_customer['id']
    customer.plan = plan
    customer.save()

    response = redirect('publisher:index')

    return response