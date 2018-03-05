from django.shortcuts import redirect

import stripe


def payment(request):
    user = request.user
    if request.method == 'POST':
        payload = request.POST
        plan = payload['plan']
        stripe_token = payload['stripeToken']
        customer = stripe.Customer.retrieve(user.customer.customer_id)
        response = customer.sources.create(source=stripe_token)
        print(response)
        print(plan)
        return redirect('dashboard:index')
