from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.urls import reverse_lazy

from .models import Company, Employee


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

    def render_to_response(self, context, **response_kwargs):
        response = super(CompanyDetail, self).render_to_response(context, **response_kwargs)
        active_company_id = context['company'].id
        print(f"Setting active company id: {active_company_id}")
        response.set_cookie('active_company_id', active_company_id)
        return response

class CompanyList(LoginRequiredMixin, ListView):
    template_name = 'companies/list.html'
    model = Company
    success_url = reverse_lazy('dashboard')
    context_object_name = 'companies'

    def get_queryset(self):
        return Employee.objects.filter(account=self.request.user)
