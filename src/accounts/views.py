from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.urls import reverse_lazy

from .models import Company


class CompanyCreate(LoginRequiredMixin, CreateView):
    template_name = 'companies/add.html'
    model = Company
    fields = ('name', )
    success_url = reverse_lazy('dashboard')

    def form_valid(self, form):
        response = super(CompanyCreate, self).form_valid(form)
        form.instance.accounts.add(self.request.user)
        return response


class CompanyUpdate(LoginRequiredMixin, UpdateView):
    template_name = 'companies/edit.html'
    model = Company
    fields = ('name', )
    success_url = reverse_lazy('dashboard')


class CompanyDelete(LoginRequiredMixin, DeleteView):
    template_name = 'companies/delete.html'
    model = Company
    success_url = reverse_lazy('dashboard')


class CompanyDetail(LoginRequiredMixin, DetailView):
    template_name = 'companies/detail.html'
    model = Company
    success_url = reverse_lazy('dashboard')


class CompanyList(LoginRequiredMixin, ListView):
    template_name = 'companies/list.html'
    model = Company
    success_url = reverse_lazy('dashboard')
    context_object_name = 'companies'