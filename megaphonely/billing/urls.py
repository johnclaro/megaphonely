from django.urls import path, re_path

from .views import plan, change, index, cancel, charge, upgrade

app_name = 'billing'

urlpatterns = [
    path('', index, name='index'),
    re_path(r'^upgrade/(?P<plan>standard|advanced)/$', upgrade, name='upgrade'),
    path('charge/', charge, name='charge'),
    path('standard/', plan, name='standard'),
    path('advanced/', plan, name='advanced'),
    path('change/', change, name='change'),
    path('cancel/', cancel, name='cancel'),
]
