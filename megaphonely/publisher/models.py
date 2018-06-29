import os

from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.validators import FileExtensionValidator

from .choices import SCHEDULES, CATEGORIES, TIMES
from .managers import ContentManager, SocialManager

VIDEO_EXTENSIONS = ('mp4', 'mov')
IMAGE_EXTENSIONS = ('png', 'jpg', 'jpeg', 'gif',)
MULTIMEDIA_EXTENSIONS = VIDEO_EXTENSIONS + IMAGE_EXTENSIONS


class Social(models.Model):
    social_id = models.CharField(max_length=250)
    provider = models.CharField(max_length=30)
    username = models.CharField(max_length=100)
    fullname = models.CharField(max_length=100, blank=True)
    url = models.URLField()
    picture_url = models.URLField(blank=True)
    access_token_key = models.TextField(max_length=1000)
    access_token_secret = models.TextField(blank=True)
    category = models.CharField(max_length=10, choices=CATEGORIES,
                                default='profile')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    account = models.ForeignKey(settings.AUTH_USER_MODEL,
                                on_delete=models.CASCADE)

    objects = SocialManager()

    class Meta:
        db_table = 'socials'
        unique_together = (
            'social_id', 'provider', 'account', 'category'
        )

    def __str__(self):
        return self.get_full_screen_name()

    def get_screen_name(self):
        if self.provider != 'facebook':
            screen_name = self.username
        else:
            screen_name = self.fullname

        return screen_name

    def get_full_screen_name(self):
        screen_name = self.get_screen_name()
        full_screen_name = f"{self.provider}-{self.category}-{screen_name}"

        return full_screen_name


def get_default_schedule_time():
    today = timezone.now().today()
    hour = today.hour
    minute = today.minute

    if hour == 23 and minute >= 30:
        time = '00:00'
    else:
        hour = f'0{hour}' if hour < 10 else hour
        minute = '00' if minute >= 30 else '30'
        time = f'{hour}:{minute}'

    return time

class Content(models.Model):
    message = models.TextField(blank=True)
    slug = models.SlugField(max_length=120)
    url = models.URLField(blank=True)
    multimedia = models.FileField(
        upload_to='', blank=True, null=True,
        validators=[FileExtensionValidator(MULTIMEDIA_EXTENSIONS)]
    )
    schedule = models.CharField(
        max_length=10, choices=SCHEDULES, default='now'
    )
    is_published = models.BooleanField(default=False)
    schedule_at = models.DateField(default=timezone.now)
    schedule_time_at = models.TimeField(
        choices=TIMES, default=get_default_schedule_time
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    account = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )
    socials = models.ManyToManyField(Social)
    objects = ContentManager()

    class Meta:
        db_table = 'contents'

    def __str__(self):
        return self.message

    def is_image(self):
        name, extension = os.path.splitext(self.multimedia.name)
        extension = extension.lstrip('.')
        is_image = True if extension in IMAGE_EXTENSIONS else False

        return is_image
