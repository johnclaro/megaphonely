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
    success_url = reverse_lazy('company_list')

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


class CompanyDelete(LoginRequiredMixin, DeleteView):
    template_name = 'companies/delete.html'
    model = Company


class CompanyDetail(LoginRequiredMixin, DetailView):
    template_name = 'companies/detail.html'
    model = Company

    def render_to_response(self, context, **response_kwargs):
        response = super(CompanyDetail, self).render_to_response(
            context, **response_kwargs
        )
        active_company_id = context['company'].id
        logging.debug('Setting active company id: {active_company_id}'.format(
            active_company_id=active_company_id
        ))
        response.set_cookie('active_company_id', active_company_id)
        return response

class CompanyList(LoginRequiredMixin, ListView):
    template_name = 'companies/list.html'
    model = Company
    context_object_name = 'companies'

    def valid_company(self, cookie):
        active_company_id = int(self.request.COOKIES.get('active_company_id', 0))
        exists = Company.objects.filter(id=active_company_id).exists()
        return active_company_id and exists

    def get_queryset(self):
        companies = Company.objects.filter(employees__in=[self.request.user])
        return companies

    def render_to_response(self, context, **response_kwargs):
        companies = context['companies'].count()
        if companies == 0:
            response = redirect('company_add')
        else:
            active_company_id = int(self.request.COOKIES.get('active_company_id', 0))
            company_exists = Company.objects.filter(id=active_company_id).exists()
            if active_company_id and company_exists:
                response = redirect('company_detail', pk=active_company_id)
            else:
                response = super(CompanyList, self).render_to_response(
                    context, **response_kwargs
                )
                response.set_cookie('active_company_id', 0)

        return response


class CompanyChoose(LoginRequiredMixin, ListView):
    template_name = 'companies/list.html'
    model = Company
    context_object_name = 'companies'

    def get_queryset(self):
        companies = Company.objects.filter(employees__in=[self.request.user])
        return companies

    def render_to_response(self, context, **response_kwargs):
        companies = context['companies'].count()
        if companies == 0:
            response = redirect('company_add')
        else:
            response = super(CompanyChoose, self).render_to_response(
                context, **response_kwargs
            )
            response.set_cookie('active_company_id', 0)

        return response
