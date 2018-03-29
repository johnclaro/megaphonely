# -*- coding: utf-8 -*-
import os

import boto3
from facepy import GraphAPI


def download_s3_file(s3_key: str, s3_bucket_name: str) -> None:
    s3_object = boto3.resource('s3').Object(s3_bucket_name, s3_key)
    s3_object.download_file(s3_key)


def get_s3_multimedia_content(s3_key: str, s3_bucket_name: str) -> dict:
    download_s3_file(s3_key, s3_bucket_name)
    source = open(s3_key, 'rb')
    os.remove(s3_key)
    return source


def handler(event, context):
    s3_bucket_name = event['s3_bucket_name']
    access_token_key = event['access_token_key']
    message = event['message']
    username = event['username']
    category = event['category']
    image = event['image']
    api = GraphAPI(access_token_key)

    data = {'message': message}
    if image:
        data['path'] = 'me/photos'
        data['source'] = get_s3_multimedia_content(image, s3_bucket_name)
    else:
        data['path'] = 'me/feed' if category == 'profile' else f'{username}/feed'

    response = api.post(**data)
    return response
