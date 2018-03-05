from django.urls import path
from django.views.generic import TemplateView

from .views import payment

app_name = 'billing'

urlpatterns = [
    path('payment/', payment, name='payment'),
    path('billing/', TemplateView.as_view(template_name='billing/index.html'), name='billing'),
    path('standard/', TemplateView.as_view(template_name='billing/standard.html'), name='standard'),
    path('advanced/', TemplateView.as_view(template_name='billing/advanced.html'), name='advanced'),
    path('pricing/', TemplateView.as_view(template_name='billing/pricing.html'), name='pricing')
]
