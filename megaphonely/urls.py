from django.conf import settings
from django.contrib import admin
from django.urls import path, re_path
from django.conf.urls import include, url
from django.views.generic import TemplateView

from megaphonely.accounts.views import (CompanyList, CompanyDetail,
                                        CompanyCreate, CompanyUpdate,
                                        CompanyDelete, CompanyChoose)
from megaphonely.contents.views import (ContentList, ContentDetail,
                                        ContentCreate, ContentUpdate, ContentDelete)


admin.autodiscover()


urlpatterns = [
    re_path(r'^$', TemplateView.as_view(template_name='home.html'), name='home'),
    re_path(r'^accounts/', include('allauth.urls')),
    path(r'admin/', admin.site.urls),

    # Socials
    path(r'social/', include('social_django.urls', namespace='social')),
    path(r'connect/', TemplateView.as_view(template_name='socials/list.html'), name='social-connect'),

    # Contents
    path(r'contents/', ContentList.as_view(), name='content_list'),
    path(r'contents/create/', ContentCreate.as_view(), name='content_add'),
    path(r'contents/<int:pk>/', ContentDetail.as_view(), name='content_detail'),
    path(r'contents/<int:pk>/edit', ContentUpdate.as_view(), name='content_update'),
    path(r'contents/<int:pk>/delete/', ContentDelete.as_view(), name='content_delete'),

    # Companies
    path(r'companies/', CompanyList.as_view(), name='company_list'),
    path(r'companies/create/', CompanyCreate.as_view(), name='company_add'),
    path(r'companies/choose/', CompanyChoose.as_view(), name='company_choose'),
    re_path(r'^companies/(?P<slug>[-\w]+)/$', CompanyDetail.as_view(), name='company_detail'),
    path(r'companies/<int:pk>/edit', CompanyUpdate.as_view(), name='company_update'),
    path(r'companies/<int:pk>/delete/', CompanyDelete.as_view(), name='company_delete')
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        url(r'^__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns