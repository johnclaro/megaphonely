from django.conf.urls import url, include
from django.contrib import admin

from rest_framework import documentation
from rest_framework.routers import DefaultRouter

from contents.views import UserViewSet, ContentViewSet, SocialAccountViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'contents', ContentViewSet)
router.register(r'social_accounts', SocialAccountViewSet)

admin.autodiscover()

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^', include(router.urls)),
    url(r'^docs/', documentation.include_docs_urls(title='Einstein')),
    url(r'^accounts/', include('allauth.urls')),
    url(r'^drf/', include('rest_framework.urls', namespace='rest_framework')),
]
