"""megaphone URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic import TemplateView

urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='homepage.html'), name="homepage"),

    url(r'^accounts/', include('accounts.urls')),
    url(r'^oauth/', include('social_django.urls', namespace='social')),

    # url(r'^contents/', include('contents.urls')),

    url(r'^legal/terms/$',
        TemplateView.as_view(template_name='legal/terms.html'), name='terms'),
    url(r'^legal/privacy/$',
        TemplateView.as_view(template_name='legal/privacy.html'), name='privacy'),
    url(r'^legal/copyright/$',
        TemplateView.as_view(template_name='legal/copyright.html'), name='copyright'),

    url(r'^admin/', admin.site.urls),
]
