from django.urls import path, re_path

from .views import index, cancel, charge, change, subscribe, modify

app_name = 'billing'

urlpatterns = [
    path('', index, name='index'),
    re_path(r'^subscribe/(?P<plan>standard|premium)/$', subscribe, name='subscribe'),
    re_path(r'^change/(?P<plan>standard|premium)/$', change, name='change'),
    path('charge/', charge, name='charge'),
    path('modify/', modify, name='modify'),
    path(r'^change/(?P<plan>standard|premium)/$', cancel, name='cancel'),
]
