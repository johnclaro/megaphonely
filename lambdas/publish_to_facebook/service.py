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


def get_s3_multimedia_content(s3_key: str, s3_bucket_name: str,
                              tmp_filename: str) -> BinaryIO:
    if not tmp_filename:
        tmp_filename = download_s3_file(s3_key, s3_bucket_name)
    source = open(tmp_filename, 'rb')
    os.remove(tmp_filename)
    return source


def handler(event, context):
    tmp_filename = event.get('tmp_filename', '')
    s3_bucket_name = event['s3_bucket_name']
    access_token_key = event['access_token_key']
    message = event['message']
    username = event['username']
    category = event['category']
    is_image = event.get('is_image', False)
    multimedia = event.get('multimedia', '')

    api = GraphAPI(access_token_key)

    data = {'message': message}
    if multimedia:
        if is_image:
            data['path'] = 'me/photos'
        elif not is_image and multimedia:
            api.url = 'https://graph-video.facebook.com'
            data['path'] = 'me/videos'
        source = get_s3_multimedia_content(multimedia, s3_bucket_name,
                                           tmp_filename)
        data['source'] = source
    else:
        data['path'] = 'me/feed' if category == 'profile' else f'{username}/feed'

    response = api.post(**data)
    return response
