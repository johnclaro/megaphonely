from django.urls import re_path, path
from django.views.generic import TemplateView

from .views import (
    index,
    ContentList,
    ContentDetail,
    ContentCreate,
    ContentUpdate,
    ContentDelete,
    social_disconnect,
    SocialList,
    TeamDetail,
    TeamList,
    TeamCreate,
    TeamUpdate
)

app_name = 'publisher'

urlpatterns = [
    path('', index, name='index'),
    path('connect/', TemplateView.as_view(template_name='socials/connect.html'), name='connect'),
    re_path('u/(?P<owner>[\w.@+-]+)/t/(?P<team>[\w.@+-]+)/contents/', ContentList.as_view(), name='content_list'),
    path('dashboard', ContentCreate.as_view(), name='content_create'),
    re_path(r'^u/(?P<owner>[\w.@+-]+)/t/(?P<team>[\w.@+-]+)/contents/(?P<pk>\d+)/$', ContentDetail.as_view(), name='content_detail'),
    re_path(r'^u/(?P<owner>[\w.@+-]+)/t/(?P<team>[\w.@+-]+)/contents/(?P<pk>\d+)/edit/$', ContentUpdate.as_view(), name='content_update'),
    re_path(r'^u/(?P<owner>[\w.@+-]+)/t/(?P<team>[\w.@+-]+)/contents/(?P<pk>\d+)/delete/$', ContentDelete.as_view(), name='content_delete'),
    re_path(r'^socials/(?P<pk>\d+)/disconnect/$', social_disconnect, name='social_disconnect'),
    path('socials/', SocialList.as_view(), name='social_list'),
    path('teams/', TeamList.as_view(), name='team_list'),
    path('teams/create/', TeamCreate.as_view(), name='team_create'),
    re_path(r'^u/(?P<owner>[\w.@+-]+)/t/(?P<team>[\w.@+-]+)/$', TeamDetail.as_view(), name='team_detail'),
    re_path(r'^u/(?P<owner>[\w.@+-]+)/t/(?P<team>[\w.@+-]+)/edit/$', TeamUpdate.as_view(), name='team_update'),
]

