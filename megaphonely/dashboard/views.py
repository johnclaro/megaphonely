from django.template import loader
from django.urls import reverse_lazy
from django.http import HttpResponse
from django.views.generic.list import ListView
from django.views.generic.detail import DetailView
from django.shortcuts import redirect, get_object_or_404
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.conf import settings
from django.utils import timezone
from django.contrib import messages
from django.utils.safestring import mark_safe
from django.template.defaultfilters import slugify

import boto3
import json

from .forms import ContentForm, TeamForm
from .models import Content, Social, Team


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
    context = {}
    if not user.is_authenticated:
        template = loader.get_template('home.html')
        response = HttpResponse(template.render(context, request))
    else:
        socials = Social.objects.filter(account=user).order_by('-updated_at')
        if not socials:
            template = loader.get_template('socials/connect.html')
        else:
            contents = Content.objects.filter(
                schedule='custom', is_published=False
            ).order_by('schedule_at')
            for content in contents:
                try:
                    if endswith_valid_image_extension(content.multimedia.url):
                        content.is_image = True
                    elif content.multimedia.url.endswith('.mp4'):
                        content.is_video = True
                except ValueError:
                    pass

            context['socials'] = socials
            context['contents'] = contents
            context['user'] = user
            context['form'] = ContentForm(account=user)
            current_plan = user.customer.plan

            if user.customer.ends_at < timezone.now():
                context['max_socials'] = 0
                context['max_contents'] = 0
                context['socials_percentage'] = 0
                context['contents_percentage'] = 0
            else:
                max_socials = settings.STRIPE_PLANS[current_plan]['socials']
                max_contents = settings.STRIPE_PLANS[current_plan]['contents']
                context['max_socials'] = max_socials
                context['max_contents'] = max_contents
                socials_pct = (context['socials'].count() / max_socials) * 100
                contents_pct = (context['contents'].count() / max_contents) * 100
                context['socials_percentage'] = int(socials_pct)
                context['contents_percentage'] = int(contents_pct)

            template = loader.get_template('dashboard.html')

        response = HttpResponse(template.render(context, request))

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
    return redirect('dashboard:index')


def publish_now(content):
    for social in content.socials.all():
        payload = {
            'message': content.message,
            'access_token_key': social.access_token_key,
            's3_bucket_name': settings.AWS_STORAGE_BUCKET_NAME
        }

        if social.provider == 'facebook':
            payload['username'] = social.username
            payload['category'] = social.category
            payload['s3_bucket_name'] = settings.AWS_STORAGE_BUCKET_NAME
            payload['image'] = ''
        elif social.provider == 'twitter':
            payload['access_token_secret'] = social.access_token_secret
            payload['consumer_key'] = settings.SOCIAL_AUTH_TWITTER_KEY
            payload['consumer_secret'] = settings.SOCIAL_AUTH_TWITTER_SECRET
        elif social.provider == 'linkedin':
            payload['cloudfront'] = settings.AWS_S3_MEDIA_DOMAIN

        if content.multimedia:
            payload['image'] = f'media/{content.multimedia.name}'

        client = boto3.client('lambda', region_name='eu-west-1')
        client.invoke(
            FunctionName=f'publish_to_{social.provider}',
            Payload=bytes(json.dumps(payload), encoding='utf8')
        )


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
        request = self.request
        user = request.user
        content.editor = user
        content.slug = slugify(content.message)
        response = super(ContentCreate, self).form_valid(form)

        if content.schedule == 'now':
            publish_now(content)

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

    def form_valid(self, form):
        content = form.instance
        request = self.request
        user = request.user
        content.account = user
        content.slug = slugify(content.message)
        response = super(ContentUpdate, self).form_valid(form)

        if content.schedule == 'now':
            publish_now(content)

        return response


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
        owner = self.kwargs['owner']
        user = self.request.user

        contents = Content.objects.filter(editor=user)
        return contents


class SocialList(LoginRequiredMixin, ListView):
    template_name = 'socials/list.html'
    model = Social
    context_object_name = 'socials'

    def get_queryset(self):
        user = self.request.user
        socials = Social.objects.filter(account=user)
        return socials


class TeamCreate(LoginRequiredMixin, CreateView):
    template_name = 'teams/add.html'
    model = Team
    form_class = TeamForm
    success_url = reverse_lazy('dashboard:index')

    def get_object(self):
        return get_object_or_404(Team, pk=self.request.user.id)

    def get_form_kwargs(self):
        user = self.request.user
        form_kwargs = super(TeamCreate, self).get_form_kwargs()
        form_kwargs['account'] = user
        return form_kwargs

    def form_valid(self, form):
        team = form.instance
        request = self.request
        user = request.user
        team.owner = user
        team.slug = slugify(team.name)
        response = super(TeamCreate, self).form_valid(form)
        team.members.add(user)

        return response


class TeamUpdate(LoginRequiredMixin, UpdateView):
    template_name = 'teams/edit.html'
    model = Team
    form_class = TeamForm
    success_url = reverse_lazy('dashboard:index')

    def get_object(self):
        user = self.request.user
        return get_object_or_404(Team, owner=user)

    def get_form_kwargs(self):
        user = self.request.user
        form_kwargs = super(TeamUpdate, self).get_form_kwargs()
        form_kwargs['account'] = user
        return form_kwargs

    def form_valid(self, form):
        team = form.instance
        team.slug = slugify(team.name)
        response = super(TeamUpdate, self).form_valid(form)

        return response


class TeamList(LoginRequiredMixin, ListView):
    template_name = 'teams/list.html'
    model = Team
    context_object_name = 'teams'

    def get_queryset(self):
        user = self.request.user
        teams = Team.objects.filter(members=user)
        return teams


class TeamDetail(LoginRequiredMixin, DetailView):
    template_name = 'teams/detail.html'
    model = Team

    def get_object(self):
        owner = self.kwargs['owner']
        user = self.request.user
        return get_object_or_404(Team,
                                 owner__username=owner, members__in=[user])