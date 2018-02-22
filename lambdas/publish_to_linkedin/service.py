# -*- coding: utf-8 -*-
import os

import boto3
from linkedin import linkedin


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

    application = linkedin.LinkedInApplication(token=access_token_key)
    response = application.submit_share(comment=message,
                                        visibility_code='connections-only')
    return response
