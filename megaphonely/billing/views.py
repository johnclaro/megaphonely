from django.shortcuts import redirect
from django.conf import settings
from django.template import loader
from django.http import HttpResponse
from django.contrib import messages
from django.contrib.auth.decorators import login_required

from .models import Customer, Subscription, PaymentMethod


@login_required
def index(request):
    template = loader.get_template('billing/index.html')
    context = {}
    response = HttpResponse(template.render(context, request))

    return response


@login_required
def pricing(request):
    user = request.user
    template = loader.get_template('pricing.html')
    subscription = Subscription.objects.get_subscription_by_customer(
        user.customer
    )
    context = {'subscription': subscription}
    response = HttpResponse(template.render(context, request))

    return response


@login_required
def subscribe(request, plan):
    template = loader.get_template('billing/plan.html')
    context = {'plan': plan, 'price': settings.STRIPE_PLANS[plan]['price']}
    response = HttpResponse(template.render(context, request))

    return response


@login_required
def change(request, plan):
    template = loader.get_template('billing/change.html')
    context = {'plan': plan, 'price': settings.STRIPE_PLANS[plan]['price']}
    response = HttpResponse(template.render(context, request))

    return response


@login_required
def perform_cancel(request, plan):
    user = request.user
    subscription = Subscription.objects.cancel_stripe_subscription(
        user.customer, plan
    )
    messages.add_message(request, messages.SUCCESS,
                         f"""Successfully cancelled your plan. 
                         You still have access until {subscription.ends_at}""")
    response = redirect('publisher:index')

    return response


@login_required
def perform_change(request):
    user = request.user
    payload = request.POST
    plan = payload['plan']
    Subscription.objects.prorotate_stripe_subscription(user.customer, plan)
    messages.add_message(request, messages.SUCCESS,
                         f'Successfully changed to the {plan.title()} plan')
    response = redirect('publisher:index')

    return response


@login_required
def perform_subscribe(request):
    user = request.user
    payload = request.POST
    plan = payload['plan']
    stripe_token = payload['stripeToken']
    stripe_customer = Customer.objects.create_stripe_customer(user)
    payment_method = PaymentMethod.objects.create_stripe_payment_method(
        stripe_token, stripe_customer, user.customer
    )
    Subscription.objects.create_stripe_subscription(
        plan, payment_method, user.customer, stripe_customer
    )
    messages.add_message(request, messages.SUCCESS,
                         f'Successfully upgraded to the {plan.title()} plan')
    response = redirect('publisher:index')

    return response