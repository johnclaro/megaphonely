from django.urls import path, re_path

from .views import plan, index, cancel, charge, change, subscribe, modify

app_name = 'billing'

urlpatterns = [
    path('', index, name='index'),
    re_path(r'^subscribe/(?P<plan>standard|premium)/$', subscribe, name='subscribe'),
    re_path(r'^change/(?P<plan>standard|premium)/$', change, name='change'),
    path('charge/', charge, name='charge'),
    path('standard/', plan, name='standard'),
    path('premium/', plan, name='premium'),
    path('modify/', modify, name='modify'),
    path('cancel/', cancel, name='cancel'),
]
