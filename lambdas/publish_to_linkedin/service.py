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
    tmp_filename = event.get('tmp_filename', '')
    access_token_key = event['access_token_key']
    message = event['message']
    multimedia = event['multimedia']
    cloudfront = event['cloudfront']
    company_id = event.get('company_id', '')
    is_image = event['is_image']

    data = {
        'title': message,
        'visibility_code': 'anyone' if tmp_filename else 'anyone',
        'comment': message
    }

    if multimedia:
        if tmp_filename:
            if is_image:
                url = 'https://s3-eu-west-1.amazonaws.com/megaphonely.com/media/contents/leagueoflegends-1528732699028-4851.jpg'
            else:
                url = 'https://s3-eu-west-1.amazonaws.com/megaphonely.com/media/contents/bus.mp4'
        else:
            url = f'https://{cloudfront}/{multimedia}'
        data['submitted_url'] = url
        data['submitted_image_url'] = url

    application = linkedin.LinkedInApplication(token=access_token_key)
    if company_id:
        data['company_id'] = company_id
        print("Posting company share...")
        response = application.submit_company_share(**data)
    else:
        response = application.submit_share(**data)

    return response
