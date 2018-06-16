# -*- coding: utf-8 -*-
import os
import json
import datetime
from collections import namedtuple

import boto3
import psycopg2


def get_scheduled_contents(cursor):
    today = datetime.datetime.now()
    cursor.execute(f"""
        SELECT content.id, content.message, content.multimedia,
               social.provider, social.access_token_key,
               social.access_token_secret
        FROM publisher_content as content
            JOIN publisher_content_socials chosen_social
            ON content.id = chosen_social.content_id
            JOIN publisher_social social
            ON chosen_social.social_id = social.id
        WHERE content.schedule_at <= '{today}'
            AND content.schedule = 'custom'
            AND content.is_published = False
    """)
    data = cursor.fetchall()
    Schedule = namedtuple('Schedule', ['id', 'message', 'multimedia',
                                       'provider', 'access_token_key',
                                       'access_token_secret'])
    schedules = (
        Schedule(*d)
        for d in data
    )
    return schedules


def trigger_lambda_publishers(schedules):
    client = boto3.client('lambda', region_name='eu-west-1')
    content_ids = []
    for schedule in schedules:
        if schedule.id not in content_ids:
            content_ids.append(schedule.id)

        payload = {
            "s3_bucket_name": os.environ["AWS_STORAGE_BUCKET_NAME"],
            "access_token_key": schedule.access_token_key,
            "access_token_secret": schedule.access_token_secret,
            "message": schedule.message
        }
        client.invoke(
            FunctionName=f"publish_to_{schedule.provider}",
            Payload=bytes(json.dumps(payload), encoding='utf8')
        )

    return content_ids


def update_contents_to_is_published(connection, cursor, content_ids):
    for content_id in content_ids:
        cursor.execute(f"""
            UPDATE publisher_content
            SET is_published = True
            WHERE publisher_content.id = {content_id}
        """)
        connection.commit()


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
        schedules = get_scheduled_contents(cursor)
        content_ids = trigger_lambda_publishers(schedules)
        update_contents_to_is_published(connection, cursor, content_ids)
    finally:
        cursor.close()
        connection.close()

    return {}
