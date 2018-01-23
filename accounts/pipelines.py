from django.db import IntegrityError

from .models import Social


def create_social(**kwargs):
    user = kwargs['user']
    response = kwargs['response']

    if not user:
        raise ValueError('You must login first')

    social_id = response['id']
    provider = 'twitter'
    Social.objects.create_social(social_id, provider, user)
