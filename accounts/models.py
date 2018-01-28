from django.db import models

from accounts import managers


class Social(models.Model):
    id = models.BigIntegerField(primary_key=True)
    username = models.CharField(max_length=100)
    fullname = models.CharField(max_length=100)
    picture_url = models.URLField()
    access_token_key = models.TextField(max_length=1000)

    class Meta:
        abstract = True

    def __str__(self):
        return self.username


class Twitter(Social):
    access_token_secret = models.TextField()
    objects = managers.TwitterManager()


class Facebook(Social):
    objects = managers.FacebookManager()


class Profile(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE)
    twitter = models.OneToOneField(Twitter, on_delete=models.CASCADE)
    facebook = models.OneToOneField(Facebook, on_delete=models.CASCADE)
