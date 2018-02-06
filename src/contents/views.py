from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.urls import reverse_lazy

from .models import Content


class ContentCreate(LoginRequiredMixin, CreateView):
    template_name = 'contents/add.html'
    model = Content
    fields = ('message',)
    success_url = reverse_lazy('dashboard')

    def form_valid(self, form):
        form.instance.account = self.request.user
        response = super(ContentCreate, self).form_valid(form)
        return response


class ContentUpdate(LoginRequiredMixin, UpdateView):
    template_name = 'contents/edit.html'
    model = Content
    fields = ('message',)
    success_url = reverse_lazy('dashboard')


class ContentDelete(LoginRequiredMixin, DeleteView):
    template_name = 'contents/delete.html'
    model = Content
    success_url = reverse_lazy('dashboard')


class ContentDetail(LoginRequiredMixin, DetailView):
    template_name = 'contents/detail.html'
    model = Content
    success_url = reverse_lazy('dashboard')


class ContentList(LoginRequiredMixin, ListView):
    template_name = 'contents/list.html'
    model = Content
    success_url = reverse_lazy('dashboard')
