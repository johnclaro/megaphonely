from django.urls import path
from django.views.generic import TemplateView

from .views import subscribe, plan, upgrade, billing

app_name = 'billing'

urlpatterns = [
    path('pricing/', TemplateView.as_view(template_name='billing/pricing.html'), name='pricing'),
    path('subscribe/', subscribe, name='subscribe'),
    path('billing/', billing, name='billing'),
    path('standard/', plan, name='standard'),
    path('advanced/', plan, name='advanced'),
    path('upgrade/', upgrade, name='upgrade')
]
