from django.contrib import admin

from .models import Social, Content, SocialLink

admin.site.register(Social)
admin.site.register(Content)
admin.site.register(SocialLink)