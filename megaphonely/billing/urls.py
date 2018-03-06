from django.urls import path
from django.views.generic import TemplateView

from .views import subscribe, plan, upgrade

app_name = 'billing'

urlpatterns = [
    path('subscribe/', subscribe, name='subscribe'),
    path('billing/', TemplateView.as_view(template_name='billing/index.html'), name='billing'),
    path('standard/', plan, name='standard'),
    path('advanced/', plan, name='advanced'),
    path('pricing/', TemplateView.as_view(template_name='billing/pricing.html'), name='pricing'),
    path('upgrade/', upgrade, name='upgrade')
]
