from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import MyUser, Profile

admin.site.register(MyUser, UserAdmin)
admin.register(Profile)
