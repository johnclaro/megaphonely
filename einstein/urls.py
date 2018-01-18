from django.conf.urls import url, include
from django.contrib import admin

from rest_framework import documentation
from rest_framework.routers import DefaultRouter

from contents.views import UserViewSet, ContentViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'contents', ContentViewSet)

admin.autodiscover()

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^', include(router.urls)),
    url(r'^docs/', documentation.include_docs_urls(title='Einstein')),
    url(r'^accounts/', include('djoser.urls')),
    url(r'^accounts/', include('djoser.urls.jwt')),
    url(r'^drf/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^oauth/', include('social_django.urls', namespace='social')),
]
