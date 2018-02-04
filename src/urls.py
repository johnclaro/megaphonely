from django.urls import path, re_path
from django.contrib import admin
from django.conf.urls import include
from django.views.generic import TemplateView
from django.conf import settings

from src.contents import views as content_views


admin.autodiscover()

urlpatterns = [
    re_path(r'^$', TemplateView.as_view(template_name='index.html'), name='index'),
    re_path(r'^accounts/', include('allauth.urls')),
    path(r'admin/', admin.site.urls),
    path(r'social/', include('social_django.urls', namespace='social')),

    # Contents
    path('contents/', content_views.ContentListView.as_view(), name='content-list'),
    path('contents/add/', content_views.ContentCreate.as_view(), name='content-add'),
    path('contents/<int:pk>/', content_views.ContentDetailView.as_view(), name='content-detail'),
    path('contents/<int:pk>/update', content_views.ContentUpdate.as_view(), name='content-update'),
    path('contents/<int:pk>/delete/', content_views.ContentDelete.as_view(), name='content-delete')
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns