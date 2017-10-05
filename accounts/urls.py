from django.conf.urls import url, include
from . import views as account_views

urlpatterns = [
    url(r'', include('registration.backends.hmac.urls')),
    url(r'profile/$', account_views.user_profile, name='user_profile'),
]
