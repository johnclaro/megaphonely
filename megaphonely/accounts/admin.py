from django.contrib import admin

from .models import Social, Company, Profile, Employee

admin.site.register(Social)
admin.site.register(Company)
admin.site.register(Profile)
admin.site.register(Employee)