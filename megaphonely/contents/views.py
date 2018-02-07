from django.urls import reverse_lazy, reverse
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.edit import CreateView, UpdateView, DeleteView

from .models import Content
from megaphonely.accounts.models import Employee


class ContentCreate(LoginRequiredMixin, CreateView):
    template_name = 'contents/add.html'
    model = Content
    fields = ('message',)
    success_url = reverse_lazy('companies-list')

    def form_valid(self, form):
        request = self.request
        company_id = int(request.COOKIES.get('active_company_id', 0))
        employee = Employee.objects.is_employed(company_id, request.user.id)
        form.instance.company = employee.company

        response = super(ContentCreate, self).form_valid(form)
        return response


class ContentUpdate(LoginRequiredMixin, UpdateView):
    template_name = 'contents/edit.html'
    model = Content
    fields = ('message',)
    success_url = reverse_lazy('companies-list')


class ContentDelete(LoginRequiredMixin, DeleteView):
    template_name = 'contents/delete.html'
    model = Content
    success_url = reverse_lazy('companies-list')


class ContentDetail(LoginRequiredMixin, DetailView):
    template_name = 'contents/detail.html'
    model = Content
    success_url = reverse_lazy('companies-list')


class ContentList(LoginRequiredMixin, ListView):
    template_name = 'contents/list.html'
    model = Content
    success_url = reverse_lazy('companies-list')
