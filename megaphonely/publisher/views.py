from django.template import loader
from django.urls import reverse_lazy
from django.http import HttpResponse
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.shortcuts import redirect, get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.conf import settings
from django.template.defaultfilters import slugify
from django.utils import timezone
from django.contrib import messages

from allauth.account.forms import SignupForm

import boto3
import json

from .forms import ContentForm
from .models import Content, Social


def index(request):
    user = request.user
    
    context = {}
    if not user.is_authenticated:
        form = SignupForm()
        context['form'] = form
        template = loader.get_template('home.html')
        response = HttpResponse(template.render(context, request))
    else:
        socials = Social.objects.filter(account=user).order_by('-updated_at')
        if not socials:
            response = redirect('publisher:connect')
        else:
            response = redirect('publisher:content_create')

    return response

def social_disconnect(request, pk):
    user = request.user
    social = get_object_or_404(Social, pk=pk, account=user)
    contents = Content.objects.filter(socials__in=[social])
    for content in contents:
        if content.socials.count() == 1:
            content.delete()
        else:
            content.socials.remove(social)
    social.delete()
    return redirect('publisher:index')

def social_prompt(request):
    user = request.user
    payload = request.POST
    print("Payload:", payload)
    response = redirect('/')
    return response

def publish_now(content):
    for social in content.socials.all():
        payload = {
            'message': content.message,
            'access_token_key': social.access_token_key,
            's3_bucket_name': settings.AWS_STORAGE_BUCKET_NAME,
            'image': ''
        }

        if social.provider == 'facebook':
            payload['username'] = social.username
            payload['category'] = social.category
            payload['s3_bucket_name'] = settings.AWS_STORAGE_BUCKET_NAME
        elif social.provider == 'twitter':
            payload['access_token_secret'] = social.access_token_secret
            payload['consumer_key'] = settings.SOCIAL_AUTH_TWITTER_KEY
            payload['consumer_secret'] = settings.SOCIAL_AUTH_TWITTER_SECRET
        elif social.provider == 'linkedin':
            payload['cloudfront'] = settings.AWS_S3_MEDIA_DOMAIN
            if social.category == 'company':
                payload['company_id'] = social.social_id

        if content.multimedia:
            payload['image'] = f'media/{content.multimedia.name}'

        client = boto3.client('lambda', region_name='eu-west-1')
        client.invoke(
            FunctionName=f'publish_to_{social.provider}',
            Payload=bytes(json.dumps(payload), encoding='utf8')
        )


class ContentCreate(LoginRequiredMixin, CreateView):
    template_name = 'contents/create.html'
    model = Content
    form_class = ContentForm
    success_url = reverse_lazy('publisher:index')

    def get_form_kwargs(self):
        user = self.request.user
        form_kwargs = super(ContentCreate, self).get_form_kwargs()
        form_kwargs['account'] = user
        return form_kwargs

    def form_valid(self, form):
        content = form.instance
        request = self.request
        user = request.user
        content.editor = user
        content.slug = slugify(content.message)

        if not content.message and not content.multimedia:
            response = super(ContentCreate, self).form_invalid(form)
            error = 'You must supply a message or a valid file'
            messages.error(request, error)
        else:
            response = super(ContentCreate, self).form_valid(form)
            if content.schedule == 'now':
                publish_now(content)
                messages.success(request, 'Successfully posted content')
            else:
                messages.success(request, 'Successfully scheduled content')

        return response

    def get_context_data(self, *args, **kwargs):
        user = self.request.user
        context = super(ContentCreate, self).get_context_data(*args, **kwargs)
        contents = Content.objects.filter(
            editor=user, schedule='date', is_published=False,
            schedule_at__gte=timezone.now()
        ).order_by('schedule_at')
        socials = Social.objects.filter(account=user).order_by('-updated_at')
        context.update({'contents': contents, 'socials': socials})
        return context


class ContentUpdate(LoginRequiredMixin, UpdateView):
    template_name = 'contents/update.html'
    model = Content
    form_class = ContentForm
    success_url = reverse_lazy('publisher:index')

    def get_form_kwargs(self):
        user = self.request.user
        form_kwargs = super(ContentUpdate, self).get_form_kwargs()
        form_kwargs['account'] = user
        return form_kwargs

    def get_queryset(self):
        user = self.request.user
        queryset = super(ContentUpdate, self).get_queryset()
        content = queryset.filter(editor=user)
        return content

    def form_valid(self, form):
        content = form.instance
        request = self.request
        user = request.user
        content.account = user
        content.slug = slugify(content.message)

        if not content.message and not content.multimedia:
            response = super(ContentUpdate, self).form_invalid(form)
            error = 'You must supply a message or a valid file'
            messages.error(request, error)
        else:
            response = super(ContentUpdate, self).form_valid(form)
            if content.schedule == 'now':
                publish_now(content)
                messages.success(request, 'Successfully posted content')
            else:
                messages.success(request, 'Successfully updated content')

        return response

    def get_context_data(self, *args, **kwargs):
        user = self.request.user
        context = super(ContentUpdate, self).get_context_data(*args, **kwargs)
        contents = Content.objects.filter(
            editor=user, schedule='date', is_published=False,
            schedule_at__gte=timezone.now()
        ).order_by('schedule_at')
        socials = Social.objects.filter(account=user).order_by('-updated_at')
        context.update({'contents': contents, 'socials': socials})
        return context


class ContentDelete(LoginRequiredMixin, DeleteView):
    template_name = 'contents/delete.html'
    model = Content
    context_object_name = 'content'
    success_message = 'Successfully deleted content'
    success_url = reverse_lazy('publisher:index')

    def delete(self, request, *args, **kwargs):
        messages.success(self.request, self.success_message)
        return super(ContentDelete, self).delete(request, *args, **kwargs)


class ContentDetail(LoginRequiredMixin, DetailView):
    template_name = 'contents/detail.html'
    model = Content


class ContentList(LoginRequiredMixin, ListView):
    template_name = 'contents/list.html'
    model = Content
    context_object_name = 'contents'

    def get_queryset(self):
        user = self.request.user
        contents = Content.objects.filter(editor=user)
        return contents
