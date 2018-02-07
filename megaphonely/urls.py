from django.urls import re_path
from django.conf import settings
from django.contrib import admin
from django.conf.urls import include, url
from django.views.generic import TemplateView


admin.autodiscover()


urlpatterns = [
    re_path(r'^$', TemplateView.as_view(template_name='home.html'), name='home'),
    re_path(r'^accounts/', include('allauth.urls')),
    re_path(r'^admin/', admin.site.urls),
    re_path(r'^contents/', include('megaphonely.contents.urls', namespace='contents')),
    re_path(r'^social/', include('social_django.urls', namespace='social')),
    re_path(r'^connect/$', TemplateView.as_view(template_name='socials/list.html'), name='social-connect'),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns