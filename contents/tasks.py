import boto3
import twitter
from facepy import GraphAPI
from celery import shared_task

from django.conf import settings


def get_s3_file(key):
    bucket = settings.AWS_STORAGE_BUCKET_NAME
    body = boto3.resource('s3').Bucket(bucket).Object(key).get()['Body']
    return body


@shared_task
def publish_to_twitter(access_token_key, access_token_secret, message,
                       media=None):
    api = twitter.Api(
        consumer_key=settings.SOCIAL_AUTH_TWITTER_KEY,
        consumer_secret=settings.SOCIAL_AUTH_TWITTER_SECRET,
        access_token_key=access_token_key,
        access_token_secret=access_token_secret,
    )
    return api.PostUpdate(message, media)


@shared_task
def publish_to_facebook(access_token_key, message, image=None, video=None):
    data = {'message': message}
    api = GraphAPI(access_token_key)
    if video:
        api.url = 'https://graph-video.facebook.com'
        data['path'] = 'me/videos'
        data['source'] = get_s3_file(video)
    elif image:
        data['path'] = 'me/photos'
        data['source'] = get_s3_file(image)
    else:
        data['path'] = 'me/feed'
    return api.post(**data)
