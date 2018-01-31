import os

import boto3
import twitter
from facepy import GraphAPI
from celery import shared_task
from botocore.response import StreamingBody

from django.conf import settings


def get_s3_file_streaming_body(key: str) -> StreamingBody:
    s3_object = boto3.resource('s3').Object(settings.AWS_STORAGE_BUCKET_NAME,
                                            key)
    streaming_body = s3_object.get()['Body']
    return streaming_body


def get_s3_file_presigned_url(key: str) -> str:
    s3_client = boto3.client('s3')
    params = {'Bucket': settings.AWS_STORAGE_BUCKET_NAME, 'Key': key}
    presigned_url = s3_client.generate_presigned_url('get_object', params)
    return presigned_url


def download_s3_file(key: str) -> None:
    s3_object = boto3.resource('s3').Object(settings.AWS_STORAGE_BUCKET_NAME,
                                            key)
    s3_object.download_file(key)


@shared_task
def publish_to_twitter(access_token_key, access_token_secret, message,
                       image=None, video=None):
    api = twitter.Api(
        consumer_key=settings.SOCIAL_AUTH_TWITTER_KEY,
        consumer_secret=settings.SOCIAL_AUTH_TWITTER_SECRET,
        access_token_key=access_token_key,
        access_token_secret=access_token_secret,
    )
    data = {}
    if video:
        # TODO: Would prefer to just supply an S3 pre signed url
        download_s3_file(video)
        data['media'] = open(video, 'rb')
        os.remove(video)
    elif image:
        data['media'] = get_s3_file_presigned_url(image)
    response = api.PostUpdate(message, **data)
    return response


@shared_task
def publish_to_facebook(access_token_key, message, image=None, video=None):
    # https://developers.facebook.com/docs/graph-api/common-scenarios/
    data = {'message': message}
    api = GraphAPI(access_token_key)

    if video:
        api.url = 'https://graph-video.facebook.com'
        data['path'] = 'me/videos'
        data['file_url'] = get_s3_file_presigned_url(video)
    elif image:
        data['path'] = 'me/photos'
        data['source'] = get_s3_file_streaming_body(image)
    else:
        data['path'] = 'me/feed'

    response = api.post(**data)
    return response
