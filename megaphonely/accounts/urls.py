from django.urls import re_path, path
from django.views.generic import TemplateView

from .views import ProfileUpdate, payment

app_name = 'accounts'

urlpatterns = [
    path('payment/', payment, name='payment'),
    re_path(r'^(?P<pk>\d+)/edit/$', ProfileUpdate.as_view(), name='profile_update'),
]
