# -*- coding: utf-8 -*-
import os

import boto3
from facepy import GraphAPI


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
    s3_bucket_name = event['s3_bucket_name']
    access_token_key = event['access_token_key']
    message = event['message']
    video = ''
    image = ''

    data = {'message': message}
    api = GraphAPI(access_token_key)

    if video:
        api.url = 'https://graph-video.facebook.com'
        data['path'] = 'me/videos'
        data = get_s3_multimedia_content(data, 'source', video, s3_bucket_name)
    elif image:
        data['path'] = 'me/photos'
        data = get_s3_multimedia_content(data, 'source', image, s3_bucket_name)
    else:
        data['path'] = 'me/feed'

    response = api.post(**data)
    return response
