from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.urls import reverse_lazy

from .models import Content


class ContentCreate(LoginRequiredMixin, CreateView):
    model = Content
    fields = '__all__'


class ContentUpdate(LoginRequiredMixin, UpdateView):
    model = Content
    fields = '__all__'


class ContentDelete(LoginRequiredMixin, DeleteView):
    model = Content
    success_url = reverse_lazy('Content-list')


class ContentDetailView(LoginRequiredMixin, DetailView):
    model = Content


class ContentListView(LoginRequiredMixin, ListView):
    model = Content

