import os

import boto3
import twitter
from facepy import GraphAPI
from celery import shared_task
from botocore.response import StreamingBody

from django.conf import settings


def get_s3_file_streaming_body(key: str) -> StreamingBody:
    bucket = settings.AWS_STORAGE_BUCKET_NAME
    streaming_body = boto3.resource('s3').Object(bucket, key).get()['Body']
    return streaming_body


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
    # https://developers.facebook.com/docs/graph-api/common-scenarios/
    data = {'message': message}
    api = GraphAPI(access_token_key)
    if video:
        api.url = 'https://graph-video.facebook.com'
        data['path'] = 'me/videos'

        # TODO: Use get_s3_file_streaming_body instead
        bucket = settings.AWS_STORAGE_BUCKET_NAME
        boto3.resource('s3').Object(bucket, video).download_file(video)
        with open(video, 'rb') as read_file:
            data['source'] = read_file
            response = api.post(**data)
        os.remove(video)

    elif image:
        data['path'] = 'me/photos'
        data['source'] = get_s3_file_streaming_body(image)
        response = api.post(**data)
    else:
        data['path'] = 'me/feed'
        response = api.post(**data)

    return response
