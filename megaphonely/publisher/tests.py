import os
from typing import BinaryIO

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.conf import settings
from django.utils import timezone

import boto3
import twitter
from facepy import GraphAPI
from linkedin import linkedin

from .models import Social

User = get_user_model()
TEST_FACEBOOK_ACCESS_TOKEN = 'EAAY8CZCqoStABABkYMHRByG0tF8EN1eWNBEf710gi0BN2Td17xlt50XKxBcbDB2ysdf5LZB7OKDxcavmgHKEG7phgWlaAfqeSr0Tx9280AmwLKB3ZBkVP16RxX58xEqHCx39lix64eZABNibPOEy5Nn375VF62et8AGLZCmoe7QhXPJlVWiap'
TEST_FACEBOOK_USERNAME = '112409579595316'
TEST_LINKEDIN_ACCESS_TOKEN = 'AQXTBAZBPkl5Y18klCM_1fN7m7Sif2pPyeZaQZ_LA1ncMY9cF4Fyi1S0q05LjQa81Hu5hNSarMBmy0h_pUSlZAd5pAHvgw1RTw1ExlO0zZuF8sfwTF91qMu3ndr_mPN1ey4bjGK-gG5zm2hU3aqvvbHKNvPpvKwOcRiwvERD45LOciPcwZfp9atpivUB3sfcVlSn9GWEdoHB_GyLoV8yqH594PxUfsAjbadyFSsZElPaA1yXy_cRoDPyJb3UXcWDwBJeggM7xQYbeBZrF-I2Mwhj5x_IdLczsf_AkvPfiBIY6Y1LDFt-DT870z5KRnMZwk2cJveyp1YIZwwKDOUrEYMNDmU61g'
TEST_TWITTER_ACCESS_TOKEN_KEY = '1007374797918130177-RgCRtgEaHcef5tXM7MrYXRB4QDFhWH'
TEST_TWITTER_ACCESS_TOKEN_SECRET = 'JyxFFb9DzuubvhxEjb1j4tgDyVbWQzMMEQTNSnRpYVIc0'
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
        self.assertEqual('id' in response.keys(), True)

    def test_publish_to_facebook_image(self):
        access_token_key = TEST_FACEBOOK_ACCESS_TOKEN
        message = timezone.now()
        api = GraphAPI(access_token_key)
        s3_key = 'media/contents/small.jpg'

        data = {'message': message}
        data['path'] = 'me/photos'
        data['source'] = self.get_s3_multimedia_content(s3_key, S3_BUCKET_NAME)

        response = api.post(**data)
        self.assertEqual('post_id' in response.keys(), True)

    # def test_publish_to_linkedin_text(self):
    #     access_token_key = TEST_LINKEDIN_ACCESS_TOKEN
    #     message = str(timezone.now())
    #
    #     data = {'comment': message, 'visibility_code': 'connections-only'}
    #
    #     application = linkedin.LinkedInApplication(token=access_token_key)
    #     response = application.submit_share(**data)
    #
    #     self.assertEqual('updateKey' in response.keys(), True)
    #
    # def test_publish_to_linkedin_image(self):
    #     access_token_key = TEST_LINKEDIN_ACCESS_TOKEN
    #     message = """Donec commodo viverra arcu, eget bibendum nisl blandit id. Donec consectetur lectus risus, eu interdum mauris finibus non. Nam aliquet vestibulum ante eu pharetra. Morbi non feugiat erat. Sed non ante auctor, ullamcorper nisl id, feugiat risus. Aliquam erat volutpat. Praesent imperdiet commodo leo in commodo. Maecenas ac dolor finibus, consequat enim et, euismod nibh. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris lobortis, erat a accumsan aliquet, tortor eros tincidunt enim, sit amet cursus elit sapien et sapien. Aenean faucibus eu ligula at lacinia. Fusce et volutpat mauris. Phasellus ac sodales nulla, at fermentum tellus."""
    #     image = 'media/contents/small.jpg'
    #
    #     data = {
    #         'title': message, 'visibility_code': 'connections-only',
    #         'comment': message
    #     }
    #     if image:
    #         data['submitted_url'] = 'https://s3-eu-west-1.amazonaws.com/megaphonely.com/media/contents/5jPWq.png'
    #         data['submitted_image_url'] = 'https://s3-eu-west-1.amazonaws.com/megaphonely.com/media/contents/5jPWq.png'
    #
    #     application = linkedin.LinkedInApplication(token=access_token_key)
    #     response = application.submit_share(**data)
    #
    #     self.assertEqual('updateKey' in response.keys(), True)
    #
    # def test_publish_to_linkedin_company(self):
    #     access_token_key = TEST_LINKEDIN_ACCESS_TOKEN
    #     message = """Donec commodo viverra arcu, eget bibendum nisl blandit id. Donec consectetur lectus risus, eu interdum mauris finibus non. Nam aliquet vestibulum ante eu pharetra. Morbi non feugiat erat. Sed non ante auctor, ullamcorper nisl id, feugiat risus. Aliquam erat volutpat. Praesent imperdiet commodo leo in commodo. Maecenas ac dolor finibus, consequat enim et, euismod nibh. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris lobortis, erat a accumsan aliquet, tortor eros tincidunt enim, sit amet cursus elit sapien et sapien. Aenean faucibus eu ligula at lacinia. Fusce et volutpat mauris. Phasellus ac sodales nulla, at fermentum tellus."""
    #     image = 'media/contents/small.jpg'
    #     company_id = 18571760
    #
    #     data = {
    #         'title': message, 'visibility_code': 'connections-only',
    #         'comment': message
    #     }
    #     if image:
    #         data['submitted_url'] = 'https://s3-eu-west-1.amazonaws.com/megaphonely.com/media/contents/5jPWq.png'
    #         data['submitted_image_url'] = 'https://s3-eu-west-1.amazonaws.com/megaphonely.com/media/contents/5jPWq.png'
    #
    #     if company_id:
    #         data['company_id'] = company_id
    #         data['visibility_code'] = 'anyone'
    #
    #     application = linkedin.LinkedInApplication(token=access_token_key)
    #     response = application.submit_company_share(**data)
    #
    #     self.assertEqual('updateKey' in response.keys(), True)

    def test_publish_to_twitter_text(self):
        message = str(timezone.now())
        api = twitter.Api(
            consumer_key=settings.SOCIAL_AUTH_TWITTER_KEY,
            consumer_secret=settings.SOCIAL_AUTH_TWITTER_SECRET,
            access_token_key=TEST_TWITTER_ACCESS_TOKEN_KEY,
            access_token_secret=TEST_TWITTER_ACCESS_TOKEN_SECRET,
        )

        response = api.PostUpdate(message)
        response_json = response.AsDict()

        self.assertEqual('created_at' in response_json.keys(), True)