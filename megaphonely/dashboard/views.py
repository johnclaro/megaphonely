from django.urls import reverse_lazy
from django.template import loader
from django.http import HttpResponse
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.edit import CreateView, UpdateView, DeleteView

from .forms import ContentForm
from .models import Content, Social


def index(request):
    user = request.user
    if not user.is_authenticated:
        template = loader.get_template('home.html')
        response = HttpResponse(template.render({}, request))
    else:
        socials = Social.objects.filter(accounts__in=[user]).order_by('-updated_at')
        contents = Content.objects.filter(account=user, schedule='custom')
        context = {'socials': socials, 'contents': contents, 'user': user}
        template = loader.get_template('dashboard.html')
        response = HttpResponse(template.render(context, request))
    return response


class ContentCreate(LoginRequiredMixin, CreateView):
    template_name = 'contents/add.html'
    model = Content
    form_class = ContentForm
    success_url = reverse_lazy('dashboard:index')

    def form_valid(self, form):
        content = form.instance
        user = self.request.user
        content.account = user
        response = super(ContentCreate, self).form_valid(form)
        return response


class ContentUpdate(LoginRequiredMixin, UpdateView):
    template_name = 'contents/edit.html'
    model = Content
    form_class = ContentForm
    success_url = reverse_lazy('dashboard:index')

    def get_queryset(self):
        user = self.request.user
        queryset = super(ContentUpdate, self).get_queryset()
        queryset = queryset.filter(account=user)
        return queryset


class ContentDelete(LoginRequiredMixin, DeleteView):
    template_name = 'contents/delete.html'
    model = Content
    context_object_name = 'content'
    success_url = reverse_lazy('dashboard:index')


class ContentDetail(LoginRequiredMixin, DetailView):
    template_name = 'contents/detail.html'
    model = Content


class ContentList(LoginRequiredMixin, ListView):
    template_name = 'contents/list.html'
    model = Content
    context_object_name = 'contents'

    def get_queryset(self):
        user = self.request.user
        contents = Content.objects.filter(account=user)
        return contents


class SocialList(LoginRequiredMixin, ListView):
    template_name = 'socials/list.html'
    model = Social
    context_object_name = 'socials'

    def get_queryset(self):
        user = self.request.user
        socials = Social.objects.filter(accounts__in=[user])
        return socials

    def get_context_data(self, *args, **kwargs):
        context_data = super(SocialList, self).get_context_data(*args, **kwargs)
        return context_data