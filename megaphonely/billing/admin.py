from django.contrib import admin

from .models import (Customer, PaymentMethod, Subscription)

admin.site.register(Customer)
admin.site.register(PaymentMethod)
admin.site.register(Subscription)