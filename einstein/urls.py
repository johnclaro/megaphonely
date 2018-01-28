from django.conf.urls import url, include
from django.contrib import admin

from rest_framework import documentation
from rest_framework.routers import DefaultRouter

from accounts.views import (UserViewSet, ProfileViewSet, TwitterViewSet,
                            FacebookViewSet)
from contents.views import ContentViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'contents', ContentViewSet)
router.register(r'profiles', ProfileViewSet)
router.register(r'twitters', TwitterViewSet)
router.register(r'facebooks', FacebookViewSet)

admin.autodiscover()

urlpatterns = [
    url(r'^api/admin/', admin.site.urls),
    url(r'^api/', include(router.urls)),
    url(r'^api/docs/', documentation.include_docs_urls(title='Einstein')),
    url(r'^api/drf/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api/oauth/', include('social_django.urls', namespace='social'))
]
