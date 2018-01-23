from django.db import models


class Profile(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE)


class SocialAccountManager(models.Manager):
    def create_social_account(self, social_account_id, provider, users):
        response = self.get_or_create(
            social_account_id=social_account_id, provider=provider
        )
        social_account = response[0]
        return social_account


class SocialAccount(models.Model):
    social_account_id = models.BigIntegerField(primary_key=True)
    provider = models.CharField(max_length=30)
    users = models.ManyToManyField('auth.User')
    objects = SocialAccountManager()

    class Meta:
        unique_together = ('social_account_id', 'provider')

    def __str__(self):
        return '{provider}: {social_account_id}'.format(
            provider=self.provider, social_account_id=self.social_account_id
        )
