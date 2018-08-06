from django.urls import path
from django.views.generic import TemplateView

from .views import signup

app_name = 'landingpage'

urlpatterns = [
    path('', TemplateView.as_view(template_name='landingpage/index.html'), name='landingpage'),
    path('signup/', signup, name='signup')
]
