from django.db import IntegrityError

from .models import SocialAccount


def create_social_account(**kwargs):
    user = kwargs['user']
    response = kwargs['response']

    if not user:
        raise ValueError('You must login first')

    social_id = response['id']
    provider = 'twitter'
    SocialAccount.objects.create_social_account(social_id, provider, user)
