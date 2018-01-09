from django.conf.urls import url, include
from django.contrib import admin
from rest_framework.routers import DefaultRouter
from rest_framework.documentation import include_docs_urls

router = DefaultRouter()

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^', include(router.urls)),
    url(r'^docs/', include_docs_urls(title='Einstein')),
    url(r'^accounts/', include('djoser.urls')),
    url(r'^', include('djoser.urls.jwt')),
    url(r'^drf/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^oauth/', include('social_django.urls', namespace='social')),
]
