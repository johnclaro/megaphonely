from django.shortcuts import redirect
from django.conf import settings
from django.template import loader
from django.http import HttpResponse

import stripe

from .models import Customer


def plan(request):
    user = request.user
    plan = request.path.replace('/', '')
    plan_price = settings.STRIPE_PLANS[plan]['price']
    plan_priority = settings.STRIPE_PLANS[plan]['priority']

    customer = stripe.Customer.retrieve(user.customer.customer_id)
    if not customer['sources']['data']:
        template = loader.get_template('billing/plan.html')
        context = {'plan': plan, 'price': plan_price, 'priority': plan_priority}
        response = HttpResponse(template.render(context, request))
    else:
        template = loader.get_template('billing/upgrade.html')
        context = {'plan': plan, 'price': plan_price}
        response = HttpResponse(template.render(context, request))

    return response


def subscribe(request):
    user = request.user
    payload = request.POST
    plan = payload['plan']
    plan_id = settings.STRIPE_PLANS[plan]['id']

    customer = stripe.Customer.retrieve(user.customer.customer_id)
    stripe_token = payload['stripeToken']
    customer.sources.create(source=stripe_token)

    subscription = stripe.Subscription.create(
        customer=user.customer.customer_id, items=[{'plan': plan_id}]
    )
    customer = Customer.objects.get(account=user)
    customer.plan = plan
    customer.subscription_id = subscription['id']
    customer.save()

    response = redirect('dashboard:index')

    return response


def upgrade(request):
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
    customer.save()
    response = redirect('dashboard:index')

    return response
