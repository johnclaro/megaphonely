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
    access_token_key = event['access_token_key']
    message = event['message']
    username = event['username']
    category = event['category']
    api = GraphAPI(access_token_key)

    data = {'message': message}
    data['path'] = 'me/feed' if category == 'profile' else f'{username}/feed'

    response = api.post(**data)
    return response
