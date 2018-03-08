from django.urls import re_path

from .views import ProfileUpdate

app_name = 'accounts'

urlpatterns = [
    re_path(r'^(?P<pk>\d+)/edit/$', ProfileUpdate.as_view(), name='profile_update'),
]
