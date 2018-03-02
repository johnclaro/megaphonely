from django.urls import reverse_lazy
from django.views.generic.edit import UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth import login
from django.shortcuts import render, redirect

from .models import Profile
from .forms import SignupForm, ProfileForm


def signup(request):
    user = request.user

    if user.is_authenticated:
        return redirect('dashboard:index')

    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('dashboard:index')
    else:
        form = SignupForm()
    return render(request, 'registration/signup.html', {'form': form})


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
