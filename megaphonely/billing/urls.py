from django.urls import path

from .views import subscribe, plan, change, billing, cancel, pricing

app_name = 'billing'

urlpatterns = [
    path('pricing/', pricing, name='pricing'),
    path('subscribe/', subscribe, name='subscribe'),
    path('billing/', billing, name='billing'),
    path('standard/', plan, name='standard'),
    path('advanced/', plan, name='advanced'),
    path('change/', change, name='change'),
    path('cancel/', cancel, name='cancel')
]
