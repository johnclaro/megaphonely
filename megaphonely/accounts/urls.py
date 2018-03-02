from django.urls import re_path, path
from django.contrib.auth import views as auth_views
from django.conf.urls import include

from . import views, forms

app_name = 'accounts'

urlpatterns = [
    path('', include('django.contrib.auth.urls')),
    path('login', auth_views.login, name='login', kwargs={"authentication_form": forms.LoginForm}),
    path('signup', views.signup, name='signup'),
    re_path(r'^(?P<pk>\d+)/edit/$', views.ProfileUpdate.as_view(), name='profile_update'),
]
