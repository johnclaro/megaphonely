from django.shortcuts import redirect
from django.conf import settings
from django.template import loader
from django.http import HttpResponse, Http404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist

from .models import Customer, Subscription, PaymentMethod, Plan


@login_required
def index(request):
    user = request.user
    try:
        customer = user.customer
        template = loader.get_template('billing/index.html')
        context = {}
        response = HttpResponse(template.render(context, request))
        return response
    except ObjectDoesNotExist:
        raise Http404()


@login_required
def pricing(request):
    user = request.user
    template = loader.get_template('pricing.html')
    subscription = user.customer.subscription
    context = {
        'subscription': subscription
    }
    response = HttpResponse(template.render(context, request))

    return response


@login_required
def subscribe(request, plan):
    template = loader.get_template('billing/plan.html')
    plan = Plan.objects.get_plan(plan)
    context = {
        'plan': plan.name,
        'price': plan.price,
        'stripe_public_key': settings.STRIPE_PUBLIC_KEY
    }
    response = HttpResponse(template.render(context, request))

    return response


@login_required
def change(request, plan):
    template = loader.get_template('billing/change.html')
    plan = Plan.objects.get_plan(plan)
    context = {
        'plan': plan.name,
        'price': plan.price
    }
    response = HttpResponse(template.render(context, request))

    return response


@login_required
def perform_cancel(request, plan):
    user = request.user
    plan = Plan.objects.get_plan(plan)
    Subscription.objects.cancel_stripe_subscription(user, plan)
    message = f'Successfully cancelled your plan. ' \
              f'You still have access until ' \
              f'{user.customer.subscription.ends_at.strftime("%B %d, %Y %H:%M")}'
    messages.success(request, message)
    response = redirect('publisher:index')

    return response


@login_required
def perform_change(request):
    user = request.user
    plan_name = request.POST['plan']
    plan = Plan.objects.get_plan(plan_name)
    Subscription.objects.prorotate_stripe_subscription(user, plan)
    message = f'Successfully upgraded to the {plan_name.title()} plan'
    messages.success(request, message)
    response = redirect('publisher:index')

    return response


@login_required
def perform_subscribe(request):
    user = request.user
    payload = request.POST
    plan_name = payload['plan']
    stripe_token = payload['stripeToken']
    stripe_customer = Customer.objects.get_stripe_customer(user)
    payment_method = PaymentMethod.objects.create_stripe_payment_method(
        stripe_token, stripe_customer, user.customer
    )
    plan = Plan.objects.get_plan(plan_name)
    Subscription.objects.update_subscription(user, payment_method, plan)
    message = f'Successfully upgraded to the {plan_name.title()} plan'
    messages.success(request, message)
    response = redirect('publisher:index')

    return response


@login_required
def perform_reactivate(request):
    user = request.user
    Subscription.objects.reactivate_stripe_subscription(user)
    messages.success(request, 'Successfully reactivated plan')
    response = redirect('publisher:index')

    return response
