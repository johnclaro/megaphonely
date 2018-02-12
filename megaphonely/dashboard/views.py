from django.template import loader
from django.urls import reverse_lazy
from django.http import HttpResponse
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.shortcuts import redirect, get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.edit import CreateView, UpdateView, DeleteView

from .forms import ContentForm
from .models import Content, Social, SocialLink


def index(request):
    user = request.user
    if not user.is_authenticated:
        template = loader.get_template('home.html')
        response = HttpResponse(template.render({}, request))
    else:
        socials = Social.objects.filter(social_links=user).order_by('-updated_at')
        contents = Content.objects.filter(account=user, schedule='custom')
        context = {'socials': socials, 'contents': contents, 'user': user}
        template = loader.get_template('dashboard.html')
        response = HttpResponse(template.render(context, request))
    return response


def social_disconnect(request, pk):
    user = request.user
    social_link = get_object_or_404(SocialLink, social=pk, account=user)
    social_link.delete()
    return redirect('dashboard:index')


class ContentCreate(LoginRequiredMixin, CreateView):
    template_name = 'contents/add.html'
    model = Content
    form_class = ContentForm

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

    def get_queryset(self):
        user = self.request.user
        queryset = super(ContentUpdate, self).get_queryset()
        content = queryset.filter(account=user)
        return content


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