from django.urls import reverse_lazy
from django.views.generic.edit import UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import redirect

import stripe

from .models import Profile
from .forms import ProfileForm


def payment(request):
    user = request.user
    if request.method == 'POST':
        payload = request.POST
        plan = payload['plan']
        stripe_token = payload['stripeToken']
        customer = stripe.Customer.retrieve(user.profile.stripe_id)
        response = customer.sources.create(source=stripe_token)
        print(response)
        return redirect('dashboard:index')


class ProfileUpdate(LoginRequiredMixin, UpdateView):
    template_name = 'profiles/edit.html'
    model = Profile
    form_class = ProfileForm
    success_url = reverse_lazy('dashboard:index')

    def get_form_kwargs(self):
        user = self.request.user
        form_kwargs = super(ProfileUpdate, self).get_form_kwargs()
        form_kwargs['account'] = user
        return form_kwargs
