from django.urls import re_path

from .views import (
    index, ContentList, ContentDetail, ContentCreate, ContentUpdate,
    ContentDelete
)

app_name = 'dashboard'

urlpatterns = [
    re_path(r'^$', index, name='index'),
    re_path(r'^contents/$', ContentList.as_view(), name='content_list'),
    re_path(r'^contents/create/$', ContentCreate.as_view(), name='content_add'),
    re_path(r'^contents/<int:pk>/$', ContentDetail.as_view(), name='content_detail'),
    re_path(r'^contents/<int:pk>/edit$', ContentUpdate.as_view(), name='content_update'),
    re_path(r'^contents/<int:pk>/delete/$', ContentDelete.as_view(), name='content_delete')
]

