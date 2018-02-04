from django.urls import path
from django.contrib import admin
from django.conf.urls import url, include
from django.views.generic import TemplateView

from src.contents.views import ContentCreate, ContentDelete, ContentUpdate


admin.autodiscover()

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='home.html'), name='home'),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^admin/', admin.site.urls),
    url(r'^social/', include('social_django.urls', namespace='social')),
    path('contents/add/', ContentCreate.as_view(), name='content-add'),
    path('contents/<int:pk>/', ContentUpdate.as_view(), name='content-update'),
    path('contents/<int:pk>/delete/', ContentDelete.as_view(), name='content-delete')
]
