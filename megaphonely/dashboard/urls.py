from django.urls import re_path

from .views import (
    index,
    ContentDetail, ContentCreate, ContentUpdate, ContentDelete,
    disconnect, SocialDetail
)

app_name = 'dashboard'

urlpatterns = [
    re_path(r'^$', index, name='index'),
    re_path(r'^contents/create/$', ContentCreate.as_view(), name='content_add'),
    re_path(r'^contents/(?P<pk>\d+)/$', ContentDetail.as_view(), name='content_detail'),
    re_path(r'^contents/(?P<pk>\d+)/edit/$', ContentUpdate.as_view(), name='content_update'),
    re_path(r'^contents/(?P<pk>\d+)/delete/$', ContentDelete.as_view(), name='content_delete'),
    re_path(r'^socials/(?P<pk>\d+)/$', SocialDetail.as_view(), name='social_detail'),
    re_path(r'^socials/(?P<pk>\d+)/disconnect/$', disconnect, name='social_disconnect'),
]

