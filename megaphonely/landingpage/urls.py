from django.urls import path
from django.views.generic import TemplateView

from .views import index, signup

app_name = 'landingpage'

urlpatterns = [
    path('', index, name='index'),
    path('signup/', signup, name='signup')
]
