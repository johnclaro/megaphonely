from django.urls import re_path, path
from django.conf.urls import include
from django.contrib.auth.views import LoginView

from .forms import LoginForm
from . import views

app_name = 'accounts'

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', LoginView.as_view(authentication_form=LoginForm, redirect_authenticated_user=True), name='login'),
    re_path('^', include('django.contrib.auth.urls')),
    re_path(r'^(?P<pk>\d+)/edit/$', views.ProfileUpdate.as_view(), name='profile_update'),
]
