import os

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.conf import settings
from django.utils import timezone

import boto3
from facepy import GraphAPI

from .models import Social

User = get_user_model()
BILL_ALBDGHHBCCEHD_BHARAMBESON_ACCESS_TOKEN = 'EAAY8CZCqoStABABkYMHRByG0tF8EN1eWNBEf710gi0BN2Td17xlt50XKxBcbDB2ysdf5LZB7OKDxcavmgHKEG7phgWlaAfqeSr0Tx9280AmwLKB3ZBkVP16RxX58xEqHCx39lix64eZABNibPOEy5Nn375VF62et8AGLZCmoe7QhXPJlVWiap'
BILL_ALBDGHHBCCEHD_BHARAMBESON_USERNAME = '112409579595316'


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
            'access_token': BILL_ALBDGHHBCCEHD_BHARAMBESON_ACCESS_TOKEN,
            'id': BILL_ALBDGHHBCCEHD_BHARAMBESON_USERNAME,
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

    def download_s3_file(self, s3_key: str, s3_bucket_name: str) -> None:
        s3_object = boto3.resource('s3').Object(s3_bucket_name, s3_key)
        s3_object.download_file(s3_key)

    def get_s3_multimedia_content(self, s3_key: str,
                                  s3_bucket_name: str) -> dict:
        self.download_s3_file(s3_key, s3_bucket_name)
        source = open(s3_key, 'rb')
        os.remove(s3_key)
        return source

    def test_publish_to_facebook_text(self):
        access_token_key = BILL_ALBDGHHBCCEHD_BHARAMBESON_ACCESS_TOKEN
        message = timezone.now()
        username = BILL_ALBDGHHBCCEHD_BHARAMBESON_USERNAME
        category = 'profile'
        api = GraphAPI(access_token_key)

        data = {'message': message}
        data['path'] = 'me/feed' if category == 'profile' else f'{username}/feed'

        response = api.post(**data)
        self.assertEqual(dict, type(response))

    def test_publish_to_facebook_image(self):
        access_token_key = BILL_ALBDGHHBCCEHD_BHARAMBESON_ACCESS_TOKEN
        message = timezone.now()
        api = GraphAPI(access_token_key)
        s3_key = 'small.jpg'
        s3_bucket_name = settings.AWS_STORAGE_BUCKET_NAME

        data = {'message': message}
        data['path'] = 'me/photos'
        data['source'] = self.get_s3_multimedia_content(s3_key, s3_bucket_name)

        response = api.post(**data)
        self.assertEqual(dict, type(response))
