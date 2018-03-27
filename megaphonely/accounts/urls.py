from django.urls import path

from .views import ProfileUpdate

app_name = 'accounts'

urlpatterns = [
    path('edit/', ProfileUpdate.as_view(), name='profile_update'),
]
