from django.urls import re_path, path
from django.conf.urls import include
from django.contrib.auth.views import LoginView

from . import views

app_name = 'accounts'

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', LoginView.as_view(redirect_authenticated_user=True), name='login'),
    re_path(r'^(?P<pk>\d+)/edit/$', views.ProfileUpdate.as_view(), name='profile_update'),
]
