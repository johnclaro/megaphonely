from django.contrib import admin

from .models import (Customer, PaymentMethod, Subscription, Plan)

admin.site.register(Customer)
admin.site.register(PaymentMethod)
admin.site.register(Subscription)
admin.site.register(Plan)
