from django.views.generic.edit import UpdateView
from django.contrib.auth.mixins import LoginRequiredMixin

from .models import Profile


class ProfileUpdate(LoginRequiredMixin, UpdateView):
    template_name = 'profiles/edit.html'
    model = Profile
    fields = '__all__'
