# -*- coding: utf-8 -*-
import os
from typing import BinaryIO

import boto3
from facepy import GraphAPI


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
