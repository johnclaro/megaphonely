from social_core.backends import twitter, facebook
from parameterized import parameterized

from django.test import TestCase
from django.contrib.auth.models import User

from .tests import TWITTER, FACEBOOK
from .models import Social
from .pipelines import create_social


class Pipelines(TestCase):

    def setUp(self):
        self.johndoe = User.objects.create_user(
            username='johndoe', email='johndoe@gmail.com', password='j0hnd03'
        )
        self.foobar = User.objects.create_user(
            username='foobar', email='foobar@gmail.com', password='f00b4r'
        )

    @parameterized.expand([
        ['twitter', twitter.TwitterOAuth, TWITTER]
    ])
    def test_create_social_one_users(self, name, backend, response):
        create_social(user=self.johndoe, backend=backend, response=response)

        social = Social.objects.get(id=1)
        self.assertEqual(social.social_id, response['id'])

    @parameterized.expand([
        ['twitter', twitter.TwitterOAuth, TWITTER]
    ])
    def test_create_social_multiple_users(self, name, backend, response):
        for user in [self.johndoe, self.foobar]:
            create_social(user=user, backend=backend, response=response)

        social = Social.objects.get(id=1)
        self.assertEqual(social.users.count(), 2)

    @parameterized.expand([
        ['twitter', twitter.TwitterOAuth, TWITTER]
    ])
    def test_create_social_update(self, name, backend, response):
        create_social(user=self.johndoe, backend=backend, response=response)
        response['name'] = 'Khal Drogo'
        create_social(user=self.johndoe, backend=backend, response=response)
        social = Social.objects.get(id=1)
        self.assertEqual(social.display_name, response['name'])
