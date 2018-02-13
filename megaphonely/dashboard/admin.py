from django.contrib import admin

from .models import Social, Content, SocialLink, ContentSocial

admin.site.register(Social)
admin.site.register(Content)
admin.site.register(SocialLink)
admin.site.register(ContentSocial)