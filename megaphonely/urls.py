from django.conf import settings
from django.contrib import admin
from django.urls import path, re_path
from django.conf.urls import include, url
from django.views.generic import TemplateView

from megaphonely.contents.views import (
    ContentList, ContentDetail, ContentCreate, ContentUpdate, ContentDelete
)


admin.autodiscover()


urlpatterns = [
    re_path(r'^accounts/', include('allauth.urls')),
    re_path(r'^admin/', admin.site.urls),

    re_path(r'^$', TemplateView.as_view(template_name='home.html'), name='home'),

    # Socials
    re_path(r'social/', include('social_django.urls', namespace='social')),
    re_path(r'connect/', TemplateView.as_view(template_name='socials/list.html'), name='social-connect'),

    # Contents
    re_path(r'^contents/$', ContentList.as_view(), name='content_list'),
    re_path(r'^contents/create/$', ContentCreate.as_view(), name='content_add'),
    re_path(r'^contents/<int:pk>/$', ContentDetail.as_view(), name='content_detail'),
    re_path(r'^contents/<int:pk>/edit$', ContentUpdate.as_view(), name='content_update'),
    re_path(r'^contents/<int:pk>/delete/$', ContentDelete.as_view(), name='content_delete')
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns