from django.urls import path, re_path

from .views import (index, change, subscribe, pricing,
                    perform_change, perform_cancel, perform_subscribe,
                    perform_reactivate)

app_name = 'billing'

urlpatterns = [
    path('', index, name='index'),
    path('pricing/', pricing, name='pricing'),
    re_path(r'^subscribe/(?P<plan>standard|premium)/$', subscribe, name='subscribe'),
    re_path(r'^change/(?P<plan>standard|premium)/$', change, name='change'),
    path('subscribe/', perform_subscribe, name='charge'),
    path('change/', perform_change, name='modify'),
    path('reactivate/', perform_reactivate, name='reactivate'),
    re_path(r'^cancel/(?P<plan>standard|premium)/$', perform_cancel, name='cancel'),
]
