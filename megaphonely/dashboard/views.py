from django.template import loader
from django.urls import reverse_lazy
from django.http import HttpResponse
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.shortcuts import redirect, get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.edit import CreateView, UpdateView, DeleteView

from .forms import ContentForm
from .models import Content, Social


def endswith_valid_image_extension(url):
    valid_image_extensions = ('.jpg', '.png')
    valid = False
    for valid_image_extension in valid_image_extensions:
        if url.endswith(valid_image_extension):
            valid = True
            break
    return valid


def index(request):
    user = request.user
    if not user.is_authenticated:
        template = loader.get_template('home.html')
        response = HttpResponse(template.render({}, request))
    else:
        socials = Social.objects.filter(accounts__in=[user]).order_by('-updated_at')
        contents = Content.objects.filter(account=user, schedule='custom', is_published=False).order_by('schedule_at')
        for content in contents:
            try:
                if endswith_valid_image_extension(content.multimedia.url):
                    content.is_image = True
                elif content.multimedia.url.endswith('.mp4'):
                    content.is_video = True
            except ValueError:
                pass

        context = {'socials': socials, 'contents': contents, 'user': user}
        template = loader.get_template('dashboard.html')
        response = HttpResponse(template.render(context, request))
    return response


def social_disconnect(request, pk):
    user = request.user
    social = get_object_or_404(Social, pk=pk, accounts__in=[user])
    social.accounts.remove(user)
    contents = Content.objects.filter(socials__in=[social])
    for content in contents:
        content.socials.remove(social)
    return redirect('dashboard:index')


class ContentCreate(LoginRequiredMixin, CreateView):
    template_name = 'contents/add.html'
    model = Content
    form_class = ContentForm
    success_url = reverse_lazy('dashboard:index')

    def get_form_kwargs(self):
        user = self.request.user
        form_kwargs = super(ContentCreate, self).get_form_kwargs()
        form_kwargs['account'] = user
        return form_kwargs

    def form_valid(self, form):
        content = form.instance
        user = self.request.user
        content.account = user
        response = super(ContentCreate, self).form_valid(form)

        for social in content.socials.all():
            if social.provider == 'facebook':
                from facepy import GraphAPI
                data = {'message': content.message}
                api = GraphAPI(social.access_token_key)
                data['path'] = 'me/feed'
                api.post(**data)

        return response


class ContentUpdate(LoginRequiredMixin, UpdateView):
    template_name = 'contents/edit.html'
    model = Content
    form_class = ContentForm
    success_url = reverse_lazy('dashboard:index')

    def get_form_kwargs(self):
        user = self.request.user
        form_kwargs = super(ContentUpdate, self).get_form_kwargs()
        form_kwargs['account'] = user
        return form_kwargs

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
