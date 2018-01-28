import boto3
import twitter
from facepy import GraphAPI
from celery import shared_task

from django.conf import settings


def get_s3_file(s3_filename):
    bucket = settings.AWS_STORAGE_BUCKET_NAME
    client = boto3.client('s3')
    s3_object = client.get_object(Bucket=bucket, Key=s3_filename)
    return s3_object['Body'].read()


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
def publish_to_facebook(access_token_key, id, message, media=None):
    api = GraphAPI(access_token_key)
    path = 'me/feed'.format(id=id)
    data = {'message': message}
    return api.post(path=path, **data)
