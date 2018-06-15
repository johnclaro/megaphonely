from django.urls import reverse_lazy
from django.views.generic.edit import UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import get_object_or_404

from .models import Profile
from .forms import ProfileForm


class ProfileUpdate(LoginRequiredMixin, UpdateView):
    template_name = 'profiles/edit.html'
    model = Profile
    form_class = ProfileForm
    success_url = reverse_lazy('publisher:index')

    def get_object(self):
        return get_object_or_404(Profile, pk=self.request.user.id)

    def get_form_kwargs(self):
        user = self.request.user
        form_kwargs = super(ProfileUpdate, self).get_form_kwargs()
        form_kwargs['account'] = user
        return form_kwargs
