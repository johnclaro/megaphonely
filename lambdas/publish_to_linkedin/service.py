# -*- coding: utf-8 -*-
import os
from typing import BinaryIO

import boto3
from linkedin import linkedin


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
    # https://developer.linkedin.com/docs/share-on-linkedin
    access_token_key = event['access_token_key']
    message = event['message']
    image = event['image']
    cloudfront = event['cloudfront']
    company_id = event['company_id']

    data = {
        'title': message, 'visibility_code': 'connections-only',
        'comment': message
    }
    if image:
        url = f'https://{cloudfront}/{image}'
        data['submitted_url'] = url
        data['submitted_image_url'] = url

    data = {
        'title': message, 'visibility_code': 'connections-only',
        'comment': message
    }
    if image:
        url = f'https://{cloudfront}/{image}'
        data['submitted_url'] = url
        data['submitted_image_url'] = url

    application = linkedin.LinkedInApplication(token=access_token_key)
    if company_id:
        data['company_id'] = company_id
        data['visibility_code'] = 'anyone'
        response = application.submit_company_share(**data)
    else:
        response = application.submit_share(**data)



    return response
