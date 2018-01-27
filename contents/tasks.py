import twitter
from celery import shared_task

from django.conf import settings

@shared_task
def publish_content_to_twitter(access_token_key, access_token_secret, message,
                               media=None):
    api = twitter.Api(
        consumer_key=settings.SOCIAL_AUTH_TWITTER_KEY,
        consumer_secret=settings.SOCIAL_AUTH_TWITTER_SECRET,
        access_token_key=access_token_key,
        access_token_secret=access_token_secret,
    )
    return api.PostUpdate(message, media)
