from django.urls import re_path, path
from django.views.generic import TemplateView

from .views import (
    index, social_disconnect,
    ContentList, ContentDetail, ContentCreate, ContentUpdate, ContentDelete,
)

app_name = 'publisher'

urlpatterns = [
    path('', index, name='index'),

    re_path(r'^socials/(?P<pk>\d+)/disconnect/$', social_disconnect, name='social_disconnect'),
    path('connect/', TemplateView.as_view(template_name='socials/connect.html'), name='connect'),

    path('dashboard/', ContentCreate.as_view(), name='content_create'),
    path('contents/', ContentList.as_view(), name='content_list'),
    re_path(r'^contents/(?P<pk>\d+)/$', ContentDetail.as_view(), name='content_detail'),
    re_path(r'^contents/(?P<pk>\d+)/update/$', ContentUpdate.as_view(), name='content_update'),
    re_path(r'^contents/(?P<pk>\d+)/delete/$', ContentDelete.as_view(), name='content_delete'),
]
