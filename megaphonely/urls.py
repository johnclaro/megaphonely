from django.conf import settings
from django.contrib import admin
from django.conf.urls import include
from django.urls import path
from django.views.generic import TemplateView
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static


admin.autodiscover()

if settings.LANDING_PAGE:
    urlpatterns = [
        path('', include('megaphonely.landingpage.urls', namespace='landingpage'))
    ]
else:
    urlpatterns = [
        path('', include('megaphonely.publisher.urls', namespace='publisher')),
        path('auth', include('allauth.urls')),
        path('billing/', include('megaphonely.billing.urls', namespace='billing')),
        path('settings/', include('megaphonely.accounts.urls', namespace='accounts')),
        path('pricing/', TemplateView.as_view(template_name='home/pricing.html'), name='pricing'),
        path('privacy/', TemplateView.as_view(template_name='home/privacy.html'), name='privacy'),
        path('terms/', TemplateView.as_view(template_name='home/terms.html'), name='terms'),
        path('social/', include('social_django.urls', namespace='social')),
    ]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += [
        path('admin/', admin.site.urls),
        path('__debug__/', include(debug_toolbar.urls)),
    ]
    urlpatterns += staticfiles_urlpatterns()
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    urlpatterns += [
        path('__6TJny9S332qv92p57585kZdM9srNA66N2s26M39U4M2232B8Uz/', admin.site.urls),
    ]
