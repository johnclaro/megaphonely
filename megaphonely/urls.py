from django.conf import settings
from django.contrib import admin
from django.conf.urls import include
from django.urls import re_path, path
from django.views.generic import TemplateView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns


admin.autodiscover()


urlpatterns = [
    path('', include('megaphonely.dashboard.urls', namespace='dashboard')),
    path('', include('allauth.urls')),
    path('profiles/', include('megaphonely.accounts.urls', namespace='accounts')),
    path('contact-us/', TemplateView.as_view(template_name='support/contact_us.html'), name='contact_us'),
    path('privacy/', TemplateView.as_view(template_name='legal/privacy.html'), name='privacy'),
    path('terms/', TemplateView.as_view(template_name='legal/terms.html'), name='terms'),
    path('billing/', TemplateView.as_view(template_name='billing/index.html'), name='billing'),
    path('standard/', TemplateView.as_view(template_name='billing/standard.html'), name='standard'),
    path('advanced/', TemplateView.as_view(template_name='billing/advanced.html'), name='advanced'),
    path('pricing/', TemplateView.as_view(template_name='billing/pricing.html'), name='pricing'),
    path('social/', include('social_django.urls', namespace='social')),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        path('admin/', admin.site.urls),
        path('__debug__/', include(debug_toolbar.urls)),
    ]
    urlpatterns += staticfiles_urlpatterns()
else:
    urlpatterns += [
        path('__6TJny9S332qv92p57585kZdM9srNA66N2s26M39U4M2232B8Uz/', admin.site.urls),
    ]
