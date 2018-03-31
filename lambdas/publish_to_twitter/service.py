# -*- coding: utf-8 -*-
import os
from typing import BinaryIO

import boto3
import twitter


def download_s3_file(s3_key: str, s3_bucket_name: str) -> str:
    s3 = boto3.resource('s3')
    filename = os.path.basename(s3_key)
    tmp_filename = f'/tmp/{filename}'
    s3.Bucket(s3_bucket_name).download_file(s3_key, tmp_filename)
    return tmp_filename


def get_s3_multimedia_content(s3_key: str, s3_bucket_name: str) -> BinaryIO:
    tmp_filename = download_s3_file(s3_key, s3_bucket_name)
    source = open(tmp_filename, 'rb')
    os.remove(tmp_filename)
    return source


def handler(event, context):
    consumer_key = event['consumer_key']
    consumer_secret = event['consumer_secret']
    s3_bucket_name = event['s3_bucket_name']
    access_token_key = event['access_token_key']
    access_token_secret = event['access_token_secret']
    message = event['message']
    image = event['image']

    api = twitter.Api(
        consumer_key=consumer_key,
        consumer_secret=consumer_secret,
        access_token_key=access_token_key,
        access_token_secret=access_token_secret,
    )
    data = {}
    if image:
        data['media'] = get_s3_multimedia_content(image, s3_bucket_name)
    response = api.PostUpdate(message, **data)
    response_json = response.AsDict()
    return response_json
