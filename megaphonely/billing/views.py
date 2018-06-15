from datetime import datetime, timedelta

from django.shortcuts import redirect
from django.conf import settings
from django.template import loader
from django.http import HttpResponse
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist

import stripe

from .models import Customer


def convert_unix_timestamp_to_human_readable_date(unix_timestamp):
    date = datetime.fromtimestamp(unix_timestamp).strftime('%Y-%m-%d %H:%M:%S')
    return date


def billing(request):
    template = loader.get_template('billing/index.html')
    context = {
        'payment_histories': [{
            'date': '1',
            'items': 'apple'
        }]
    }
    response = HttpResponse(template.render(context, request))
    return response


def plan(request):
    plan = request.path.replace('/', '')
    price = settings.STRIPE_PLANS[plan]['price']

    template = loader.get_template('billing/plan.html')
    context = {'plan': plan, 'price': price}
    response = HttpResponse(template.render(context, request))

    return response


def subscribe(request):
    user = request.user
    payload = request.POST
    plan = payload['plan']
    plan_id = settings.STRIPE_PLANS[plan]['id']
    stripe_token = payload['stripeToken']

    try:
        customer = Customer.objects.get(account=user)
        stripe_customer = stripe.Customer.retrieve(customer.customer_id)
        source = stripe_customer.sources.create(source=stripe_token)
    except ObjectDoesNotExist:
        stripe_customer = stripe.Customer.create(email=user.email)
        customer = Customer.objects.create(
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

    response = redirect('publisher:index')

    return response


def change(request):
    user = request.user
    payload = request.POST
    plan = payload['plan']
    plan_id = settings.STRIPE_PLANS[plan]['id']
    subscription = stripe.Subscription.retrieve(user.customer.subscription_id)
    stripe.Subscription.modify(
        user.customer.subscription_id,
        items=[{
            'id': subscription['items']['data'][0].id,
            'plan': plan_id
        }]
    )
    customer = Customer.objects.get(account=user)
    customer.plan = plan
    customer.ends_at = timezone.now() + timedelta(days=31)
    customer.save()
    response = redirect('publisher:index')

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
