# -*- coding: utf-8 -*-
import os
import json
import logging
import datetime
from collections import namedtuple

import boto3
import psycopg2


def get_scheduled_contents(cursor):
    today = datetime.datetime.now()
    cursor.execute(f"""
        SELECT content.message, content.multimedia, social.provider, 
               social.access_token_key, social.access_token_secret
        FROM dashboard_content as content
            JOIN dashboard_content_socials chosen_social 
            ON content.id = chosen_social.content_id
            JOIN dashboard_social social 
            ON chosen_social.social_id = social.id
        WHERE content.schedule_at <= '{today}'
            AND content.schedule = 'custom'
            AND content.is_published = False
    """)
    data = cursor.fetchall()
    Schedule = namedtuple('Schedule', ['message', 'multimedia', 'provider',
                                       'access_token_key',
                                       'access_token_secret'])
    schedules = []
    for d in data:
        schedule = Schedule(*d)
        schedules.append(schedule)
    return schedules


def handler(event, context):
    rds_username = os.environ['RDS_USERNAME']
    rds_password = os.environ['RDS_PASSWORD']
    rds_host = os.environ['RDS_HOST']
    rds_database = os.environ['RDS_DATABASE']

    connection = psycopg2.connect(
        f"postgresql://{rds_username}:{rds_password}@{rds_host}/{rds_database}"
    )
    cursor = connection.cursor()
    try:
        client = boto3.client('lambda', region_name='eu-west-1')
        schedules = get_scheduled_contents(cursor)
        logging.info(f"Got {len(schedules)} contents scheduled")
        for schedule in schedules:
            payload = {
                "s3_bucket_name": os.environ["AWS_STORAGE_BUCKET_NAME"],
                "consumer_key": os.environ["TWITTER_CONSUMER_KEY"],
                "consumer_secret": os.environ["TWITTER_CONSUMER_SECRET"],
                "access_token_key": schedule.access_token_key,
                "access_token_secret": schedule.access_token_secret,
                "message": schedule.message
            }
            client.invoke(
                FunctionName=f"publish_to_{schedule.provider}",
                Payload=bytes(json.dumps(payload), encoding='utf8')
            )
    finally:
        cursor.close()
        connection.close()

    return {}
