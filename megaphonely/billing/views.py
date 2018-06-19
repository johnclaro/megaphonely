from datetime import timedelta

from django.shortcuts import redirect
from django.conf import settings
from django.template import loader
from django.http import HttpResponse
from django.utils import timezone

import stripe

from .models import Customer


def index(request):
    template = loader.get_template('billing/index.html')
    context = {}
    response = HttpResponse(template.render(context, request))
    return response


def upgrade(request, plan):
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


def subscribe(request):
    user = request.user
    payload = request.POST
    plan = payload['plan']
    stripe_token = payload['stripeToken']

    customer = Customer.objects.upsert(user, plan, stripe_token)
    print("Got customer:", customer)

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


def charge(request):
    user = request.user
    payload = request.POST
    plan = payload['plan']
    stripe_token = payload['stripeToken']

    customer = Customer.objects.upsert(user, plan, stripe_token)
    print("Got customer:", customer)

    response = redirect('publisher:index')

    return response