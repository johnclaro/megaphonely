# -*- coding: utf-8 -*-
import os

import boto3
import twitter


def download_s3_file(s3_key: str, s3_bucket_name: str) -> None:
    s3_object = boto3.resource('s3').Object(s3_bucket_name, s3_key)
    s3_object.download_file(s3_key)


def get_s3_multimedia_content(payload: dict, key: str, s3_key: str,
                              s3_bucket_name: str) -> dict:
    download_s3_file(s3_key, s3_bucket_name)
    payload[key] = open(s3_key, 'rb')
    os.remove(s3_key)
    return payload

def handler(event, context):
    consumer_key = event['consumer_key']
    consumer_secret = event['consumer_secret']
    s3_bucket_name = event['s3_bucket_name']
    access_token_key = event['access_token_key']
    access_token_secret = event['access_token_secret']
    message = event['message']
    video = ''
    image = ''

    api = twitter.Api(
        consumer_key=consumer_key,
        consumer_secret=consumer_secret,
        access_token_key=access_token_key,
        access_token_secret=access_token_secret,
    )
    data = {}
    if video:
        data = get_s3_multimedia_content(data, 'media', video, s3_bucket_name)
    elif image:
        data = get_s3_multimedia_content(data, 'media', image, s3_bucket_name)
    response = api.PostUpdate(message, **data)
    response_json = response.AsDict()
    return response_json
