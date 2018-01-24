from .models import Social


def create_social(**kwargs):
    user = kwargs['user']
    response = kwargs['response']
    backend = kwargs['backend']

    if not user:
        raise ValueError('You must login first')

    Social.objects.upsert(
        social_id=response['id'],
        provider=backend.name,
        screen_name=response['screen_name'],
        display_name=response['name'],
        profile_picture_url=response['profile_image_url_https'],
        access_token_key=response['access_token']['oauth_token'],
        access_token_secret=response['access_token']['oauth_token_secret'],
        user=user,
    )
