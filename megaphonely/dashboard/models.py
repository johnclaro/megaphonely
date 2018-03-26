from django.db.models import (Model, CharField, TextField, URLField,
                              DateTimeField, ManyToManyField, BooleanField,
                              ImageField, ForeignKey, CASCADE)
from django.urls import reverse
from django.conf import settings
from django.utils import timezone

from .choices import SCHEDULES, CATEGORIES
from .managers import ContentManager, SocialManager


class Social(Model):
    social_id = CharField(max_length=250)
    provider = CharField(max_length=30)
    username = CharField(max_length=100)
    fullname = CharField(max_length=100, blank=True)
    url = URLField()
    picture_url = URLField(blank=True)
    access_token_key = TextField(max_length=1000)
    access_token_secret = TextField(blank=True)
    category = CharField(max_length=10, choices=CATEGORIES, default='profile')
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    account = ForeignKey(settings.AUTH_USER_MODEL, on_delete=CASCADE)

    objects = SocialManager()

    class Meta:
        unique_together = ('social_id', 'provider',)

    def __str__(self):
        screen_name = self.get_screen_name()
        screen_name_with_provider = f"{self.provider}-{screen_name}"

        return screen_name_with_provider

    def get_screen_name(self):
        if self.provider != 'facebook':
            screen_name = self.username
        else:
            screen_name = self.fullname

        return screen_name


class Content(Model):
    message = TextField()
    multimedia = ImageField(upload_to='contents', blank=True, null=True)
    schedule = CharField(max_length=10, choices=SCHEDULES, default='now')
    is_published = BooleanField(default=False)
    schedule_at = DateTimeField(default=timezone.now, blank=True)
    created_at = DateTimeField(auto_now_add=True)
    updated_at = DateTimeField(auto_now=True)

    account = ForeignKey(settings.AUTH_USER_MODEL, on_delete=CASCADE)
    socials = ManyToManyField(Social)

    objects = ContentManager()

    def __str__(self):
        return self.message

    def get_absolute_url(self):
        return reverse('dashboard:content_detail', kwargs={'pk': self.pk})
