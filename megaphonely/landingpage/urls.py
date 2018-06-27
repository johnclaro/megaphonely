from django.urls import path
from django.views.generic import TemplateView

app_name = 'accounts'

urlpatterns = [
    path('', TemplateView.as_view(template_name='landingpage/index.html'), name='landingpage'),
]
