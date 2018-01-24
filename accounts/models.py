from django.db import models
from django.core.exceptions import ObjectDoesNotExist


class Profile(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE)


class SocialManager(models.Manager):

    def upsert(self, social_id, provider, screen_name, display_name,
               profile_picture_url, access_token_key, access_token_secret,
               user):
        try:
            social = self.get(social_id=social_id, provider=provider)
            social.social_id = social_id
            social.provider = provider
            social.screen_name = screen_name
            social.display_name = display_name
            social.profile_picture_url = profile_picture_url
            social.access_token_key = access_token_key
            social.access_token_secret = access_token_secret
            social.save()
        except ObjectDoesNotExist:
            social = self.create(
                social_id=social_id,
                provider=provider,
                screen_name=screen_name,
                display_name=display_name,
                profile_picture_url=profile_picture_url,
                access_token_key=access_token_key,
                access_token_secret=access_token_secret
            )
        social.users.add(user)
        return social


class Social(models.Model):
    TWITTER = 'twitter'
    PROVIDER_CHOICES = (
        (TWITTER, 'Twitter'),
    )
    social_id = models.BigIntegerField()
    provider = models.CharField(max_length=30, choices=PROVIDER_CHOICES)
    screen_name = models.CharField(max_length=100)
    display_name = models.CharField(max_length=100)
    profile_picture_url = models.URLField()
    access_token_key = models.TextField(max_length=1000)
    access_token_secret = models.TextField()

    users = models.ManyToManyField('auth.User', blank=True)

    objects = SocialManager()

    class Meta:
        unique_together = ('social_id', 'provider')

    def __str__(self):
        return '{provider}: {screen_name}'.format(
            provider=self.provider, screen_name=self.screen_name
        )
