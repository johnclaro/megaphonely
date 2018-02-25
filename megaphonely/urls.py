from django.conf import settings
from django.contrib import admin
from django.conf.urls import include
from django.urls import re_path, path
from django.views.generic import TemplateView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns


admin.autodiscover()


urlpatterns = [
    re_path(r'^', include('megaphonely.dashboard.urls', namespace='dashboard')),
    path('privacy', TemplateView.as_view(template_name='legal/privacy.html')),
    path('terms', TemplateView.as_view(template_name='legal/terms.html')),
    path('pricing', TemplateView.as_view(template_name='billing/pricing.html'), name='pricing'),
    re_path(r'^profiles/', include('megaphonely.accounts.urls', namespace='accounts')),
    re_path(r'^accounts/', include('allauth.urls')),
    re_path(r'^social/', include('social_django.urls', namespace='social')),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        re_path(r'^admin/', admin.site.urls),
        re_path(r'^__debug__/', include(debug_toolbar.urls)),
    ]
    urlpatterns += staticfiles_urlpatterns()
else:
    urlpatterns += [
        re_path(r'^__6TJny9S332qv92p57585kZdM9srNA66N2s26M39U4M2232B8Uz/', admin.site.urls),
    ]
