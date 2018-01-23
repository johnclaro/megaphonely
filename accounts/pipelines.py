import json

from django.db.utils import IntegrityError

from .models import SocialAccount


def create_social_account(*args, **kwargs):
    user = kwargs['user']
    if not user:
        raise ValueError('User cannot be null!')

    try:
        response = kwargs['response']
        social_account_id = response['id']
        provider = 'twitter'
        SocialAccount.objects.create_social_account(
            social_account_id=social_account_id, provider=provider, users=[user]
        )
    except IntegrityError as duplicate:
        raise duplicate
