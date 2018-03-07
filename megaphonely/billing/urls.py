from django.urls import path

from .views import subscribe, plan, upgrade, billing, pricing

app_name = 'billing'

urlpatterns = [
    path('pricing/', pricing, name='pricing'),
    path('subscribe/', subscribe, name='subscribe'),
    path('billing/', billing, name='billing'),
    path('standard/', plan, name='standard'),
    path('advanced/', plan, name='advanced'),
    path('upgrade/', upgrade, name='upgrade')
]
