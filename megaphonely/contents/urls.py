from django.urls import re_path

from .views import (
    ContentList, ContentDetail, ContentCreate, ContentUpdate, ContentDelete
)

app_name = 'megaphonely'

urlpatterns = [
    re_path(r'^$', ContentList.as_view(), name='content_list'),
    re_path(r'^create/$', ContentCreate.as_view(), name='content_add'),
    re_path(r'^<int:pk>/$', ContentDetail.as_view(), name='content_detail'),
    re_path(r'^<int:pk>/edit$', ContentUpdate.as_view(), name='content_update'),
    re_path(r'^<int:pk>/delete/$', ContentDelete.as_view(), name='content_delete')
]