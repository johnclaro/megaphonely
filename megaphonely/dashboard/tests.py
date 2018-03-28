from django.test import TestCase
from django.contrib.auth import get_user_model

from .models import Social

User = get_user_model()


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
            'access_token': 'EAAY8CZCqoStABABkYMHRByG0tF8EN1eWNBEf710gi0BN2Td17xlt50XKxBcbDB2ysdf5LZB7OKDxcavmgHKEG7phgWlaAfqeSr0Tx9280AmwLKB3ZBkVP16RxX58xEqHCx39lix64eZABNibPOEy5Nn375VF62et8AGLZCmoe7QhXPJlVWiap',
            'id': '112409579595316',
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
