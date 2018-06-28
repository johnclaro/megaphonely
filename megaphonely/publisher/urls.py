from django.urls import re_path, path
from django.views.generic import TemplateView

from .views import (
    index, social_disconnect, social_prompt,
    ContentCreate, ContentUpdate, ContentDelete,
)

app_name = 'publisher'

urlpatterns = [
    path('', index, name='index'),

    re_path(r'^socials/(?P<pk>\d+)/disconnect/$', social_disconnect, name='social_disconnect'),
    path('connect/', TemplateView.as_view(template_name='socials/connect.html'), name='connect'),
    path('prompt/', social_prompt, name='prompt'),

    path('dashboard', ContentCreate.as_view(), name='content_create'),
    re_path(r'^contents/(?P<pk>\d+)/update/$', ContentUpdate.as_view(), name='content_update'),
    re_path(r'^contents/(?P<pk>\d+)/delete/$', ContentDelete.as_view(), name='content_delete'),
]
