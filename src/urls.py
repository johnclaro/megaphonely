from django.urls import path, re_path
from django.contrib import admin
from django.conf.urls import include
from django.views.generic import TemplateView

from src.contents.views import ContentCreate, ContentDelete, ContentUpdate


admin.autodiscover()

urlpatterns = [
    re_path(r'^$', TemplateView.as_view(template_name='home.html'), name='home'),
    re_path(r'^accounts/', include('allauth.urls')),
    path(r'admin/', admin.site.urls),
    path(r'social/', include('social_django.urls', namespace='social')),
    path('contents/add/', ContentCreate.as_view(), name='content-add'),
    path('contents/<int:pk>/update', ContentUpdate.as_view(), name='content-update'),
    path('contents/<int:pk>/delete/', ContentDelete.as_view(), name='content-delete')
]
