import logging

from django.urls import reverse_lazy
from django.shortcuts import redirect
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.edit import CreateView, UpdateView, DeleteView

from .models import Company, Employee


class CompanyCreate(LoginRequiredMixin, CreateView):
    template_name = 'companies/add.html'
    model = Company
    fields = ('name', )
    success_url = reverse_lazy('companies-list')

    def form_valid(self, form):
        response = super(CompanyCreate, self).form_valid(form)
        employee = Employee(company=form.instance,
                            account=self.request.user)
        employee.save()
        return response


class CompanyUpdate(LoginRequiredMixin, UpdateView):
    template_name = 'companies/edit.html'
    model = Company
    fields = ('name', )
    success_url = reverse_lazy('companies-list')


class CompanyDelete(LoginRequiredMixin, DeleteView):
    template_name = 'companies/delete.html'
    model = Company
    success_url = reverse_lazy('companies-list')


class CompanyDetail(LoginRequiredMixin, DetailView):
    template_name = 'companies/detail.html'
    model = Company
    success_url = reverse_lazy('companies-list')

    def render_to_response(self, context, **response_kwargs):
        response = redirect('companies-list')
        active_company_id = context['company'].id
        logging.debug('Setting active company id: {active_company_id}'.format(
            active_company_id=active_company_id
        ))
        response.set_cookie('active_company_id', active_company_id)
        return response


class CompanyList(LoginRequiredMixin, ListView):
    template_name = 'companies/list.html'
    model = Company
    success_url = reverse_lazy('companies-list')
    context_object_name = 'companies'

    def get_queryset(self):
        companies = Company.objects.filter(accounts__in=[self.request.user])
        return companies
