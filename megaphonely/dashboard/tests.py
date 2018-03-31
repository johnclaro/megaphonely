import os
from typing import BinaryIO

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.conf import settings
from django.utils import timezone

import boto3
from facepy import GraphAPI
from linkedin import linkedin

from .models import Social

User = get_user_model()
TEST_FACEBOOK_ACCESS_TOKEN = 'EAAY8CZCqoStABABkYMHRByG0tF8EN1eWNBEf710gi0BN2Td17xlt50XKxBcbDB2ysdf5LZB7OKDxcavmgHKEG7phgWlaAfqeSr0Tx9280AmwLKB3ZBkVP16RxX58xEqHCx39lix64eZABNibPOEy5Nn375VF62et8AGLZCmoe7QhXPJlVWiap'
TEST_FACEBOOK_USERNAME = '112409579595316'
TEST_LINKEDIN_ACCESS_TOKEN = 'AQUUCZG7nx9AqqC4sWckMprKAfpp2zNhHSX1XtB3Q-kkE8xo-0pP0jWx5hVWbrxOfB1ftJgaRB5gPcp0Ct3Sh6XrraTQM8IhnwYcpx6JAIIFKShq406HHPuMz3W8PA2Q8uskmA7fFs4J3UTZUNJrmDMU7w21wyIyFCZrIm2Be5ELmvX9GxGqvv5P145zY0-p2HVg_Xq03KMuzw-ANXyL5aHkdqDziZsdeqXViisd0FGjrmQ02rYoD_j6-J-3azj_Thmq8elCYEDecTIP17O-Azpe3O7uNJJpy-_L55PlGA47_SBJMxtnAhNxF6jMoDML0TdVedY4XlXL7YqjZBssJwrzU9i5ww'
S3_BUCKET_NAME = f'test.{settings.AWS_STORAGE_BUCKET_NAME}'


class SocialTestCase(TestCase):

    def setUp(self):
        User.objects.create(
            email='john@megaphonely.com', password='12345', username='john'
        )

    def test_social_facebook_profile_upsert(self):
        """Test if facebook profiles are properly upserted."""
        provider = 'facebook'
        category = 'profile'
        response = {
            'access_token': TEST_FACEBOOK_ACCESS_TOKEN,
            'id': TEST_FACEBOOK_USERNAME,
            'name': 'Bill Albdghhbccehd Bharambeson'
        }
        user = User.objects.get(email='john@megaphonely.com')
        Social.objects.upsert(provider, response, user)
        social = Social.objects.get(username=response['id'])
        self.assertEqual(social.social_id, response['id'])
        self.assertEqual(social.provider, provider)
        self.assertEqual(social.username, response['id'])
        self.assertEqual(social.fullname, response['name'])
        url = f"https://www.{provider}.com/{response['id']}"
        self.assertEqual(social.url, url)
        # self.assertEqual(picture_url)
        self.assertEqual(social.access_token_key, response['access_token'])
        self.assertEqual(social.access_token_secret, '')
        self.assertEqual(social.category, category)
        self.assertEqual(social.account, user)


class PublishTestCase(TestCase):

    def download_s3_file(self, s3_key: str, s3_bucket_name: str) -> str:
        s3 = boto3.resource('s3')
        filename = os.path.basename(s3_key)
        tmp_filename = f'/tmp/{filename}'
        s3.Bucket(s3_bucket_name).download_file(s3_key, tmp_filename)
        return tmp_filename

    def get_s3_multimedia_content(self, s3_key: str,
                                  s3_bucket_name: str) -> BinaryIO:
        tmp_filename = self.download_s3_file(s3_key, s3_bucket_name)
        source = open(tmp_filename, 'rb')
        os.remove(tmp_filename)
        return source

    def test_publish_to_facebook_text(self):
        access_token_key = TEST_FACEBOOK_ACCESS_TOKEN
        message = timezone.now()
        username = TEST_FACEBOOK_USERNAME
        category = 'profile'
        api = GraphAPI(access_token_key)

        data = {'message': message}
        data['path'] = 'me/feed' if category == 'profile' else f'{username}/feed'

        response = api.post(**data)
        self.assertEqual(dict, type(response))

    def test_publish_to_facebook_image(self):
        access_token_key = TEST_FACEBOOK_ACCESS_TOKEN
        message = timezone.now()
        api = GraphAPI(access_token_key)
        s3_key = 'media/contents/small.jpg'

        data = {'message': message}
        data['path'] = 'me/photos'
        data['source'] = self.get_s3_multimedia_content(s3_key, S3_BUCKET_NAME)

        response = api.post(**data)
        self.assertEqual(dict, type(response))

    def test_publish_to_linkedin_text(self):
        access_token_key = TEST_LINKEDIN_ACCESS_TOKEN
        message = str(timezone.now())

        data = {'comment': message, 'visibility_code': 'connections-only'}

        application = linkedin.LinkedInApplication(token=access_token_key)
        response = application.submit_share(**data)

        return response

    def test_publish_to_linkedin_image(self):
        access_token_key = TEST_LINKEDIN_ACCESS_TOKEN
        message = """Donec commodo viverra arcu, eget bibendum nisl blandit id. Donec consectetur lectus risus, eu interdum mauris finibus non. Nam aliquet vestibulum ante eu pharetra. Morbi non feugiat erat. Sed non ante auctor, ullamcorper nisl id, feugiat risus. Aliquam erat volutpat. Praesent imperdiet commodo leo in commodo. Maecenas ac dolor finibus, consequat enim et, euismod nibh. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris lobortis, erat a accumsan aliquet, tortor eros tincidunt enim, sit amet cursus elit sapien et sapien. Aenean faucibus eu ligula at lacinia. Fusce et volutpat mauris. Phasellus ac sodales nulla, at fermentum tellus."""
        image = 'small.jpg'

        data = {
            'title': message, 'visibility_code': 'connections-only',
            'comment': message
        }
        if image:
            data['submitted_url'] = 'https://s3-eu-west-1.amazonaws.com/megaphonely.com/media/contents/5jPWq.png'
            data['submitted_image_url'] = 'https://s3-eu-west-1.amazonaws.com/megaphonely.com/media/contents/5jPWq.png'

        application = linkedin.LinkedInApplication(token=access_token_key)
        response = application.submit_share(**data)

        return response
