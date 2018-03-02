from django.urls import re_path, path

from . import views

app_name = 'accounts'

urlpatterns = [
    path('signup', views.signup, name='signup'),
    re_path(r'^(?P<pk>\d+)/edit/$', views.ProfileUpdate.as_view(), name='profile_update'),
]
