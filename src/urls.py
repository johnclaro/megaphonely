from django.urls import path, re_path
from django.contrib import admin
from django.conf.urls import include, url
from django.views.generic import TemplateView
from django.conf import settings

from src.contents.views import (ContentList,  ContentDetail,
                                ContentCreate, ContentUpdate, ContentDelete)
from src.dashboard.views import dashboard_index


admin.autodiscover()

urlpatterns = [
    re_path(r'^$', TemplateView.as_view(template_name='home.html'), name='home'),
    re_path(r'^accounts/', include('allauth.urls')),
    path(r'admin/', admin.site.urls),
    path(r'social/', include('social_django.urls', namespace='social')),

    # Dashboard
    path(r'dashboard/', dashboard_index, name='dashboard'),

    # Socials
    path(r'socials/', TemplateView.as_view(template_name='socials/list.html'), name='social-list'),

    # Contents
    path(r'contents/', ContentList.as_view(), name='content-list'),
    path(r'contents/add/', ContentCreate.as_view(), name='content-add'),
    path(r'contents/<int:pk>/', ContentDetail.as_view(), name='content-detail'),
    path(r'contents/<int:pk>/update', ContentUpdate.as_view(), name='content-update'),
    path(r'contents/<int:pk>/delete/', ContentDelete.as_view(), name='content-delete')
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns