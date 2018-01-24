from social_core.backends import twitter, facebook
from nose_parameterized import parameterized

from django.test import TestCase
from django.contrib.auth.models import User

from .models import Social
from .pipelines import create_social


TWITTER = {
    "access_token": {
        "oauth_token": "901476753272655872-kJ82EuZD9h1fdtORaL5IOxEnPQPHxJw",
        "oauth_token_secret": "LIqmsCjFcGAbfUwSHqUELPWxPrtTJExR5lkS3JALovFWX",
        "screen_name": "JohnClaro3",
        "user_id": "901476753272655872",
        "x_auth_expires": "0"
    },
    "contributors_enabled": False,
    "created_at": "Sat Aug 26 16:09:41 +0000 2017",
    "default_profile": True,
    "default_profile_image": False,
    "description": "my bio",
    "entities": {
        "description": {
            "urls": []
        },
        "url": {
            "urls": [
                {
                    "display_url": "google.com",
                    "expanded_url": "http://google.com",
                    "indices": [
                        0,
                        23
                    ],
                    "url": "https://t.co/cHZdP4MpC4"
                }
            ]
        }
    },
    "favourites_count": 0,
    "follow_request_sent": False,
    "followers_count": 0,
    "following": False,
    "friends_count": 0,
    "geo_enabled": False,
    "has_extended_profile": True,
    "id": 901476753272655872,
    "id_str": "901476753272655872",
    "is_translation_enabled": False,
    "is_translator": False,
    "lang": "en",
    "listed_count": 0,
    "location": "Dublin City, Ireland",
    "name": "John Claro",
    "notifications": False,
    "profile_background_color": "F5F8FA",
    "profile_background_image_url": None,
    "profile_background_image_url_https": None,
    "profile_background_tile": False,
    "profile_banner_url": "https://pbs.twimg.com/profile_banners/901476753272655872/1508946274",
    "profile_image_url": "http://pbs.twimg.com/profile_images/923214026250899456/hVlVVOtC_normal.jpg",
    "profile_image_url_https": "https://pbs.twimg.com/profile_images/923214026250899456/hVlVVOtC_normal.jpg",
    "profile_link_color": "1DA1F2",
    "profile_sidebar_border_color": "C0DEED",
    "profile_sidebar_fill_color": "DDEEF6",
    "profile_text_color": "333333",
    "profile_use_background_image": True,
    "protected": False,
    "screen_name": "JohnClaro3",
    "status": {
        "contributors": None,
        "coordinates": None,
        "created_at": "Tue Nov 21 19:28:01 +0000 2017",
        "entities": {
            "hashtags": [],
            "symbols": [],
            "urls": [],
            "user_mentions": []
        },
        "favorite_count": 0,
        "favorited": False,
        "geo": None,
        "id": 933054409973620736,
        "id_str": "933054409973620736",
        "in_reply_to_screen_name": None,
        "in_reply_to_status_id": None,
        "in_reply_to_status_id_str": None,
        "in_reply_to_user_id": None,
        "in_reply_to_user_id_str": None,
        "is_quote_status": False,
        "lang": "en",
        "place": None,
        "retweet_count": 0,
        "retweeted": False,
        "source": "<a href=\"https://www.megaphone.social\" rel=\"nofollow\">Megaphone Social</a>",
        "text": "hold up",
        "truncated": False
    },
    "statuses_count": 167,
    "time_zone": None,
    "translator_type": "none",
    "url": "https://t.co/cHZdP4MpC4",
    "utc_offset": None,
    "verified": False
}

FACEBOOK = {}


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
        social = create_social(
            user=self.johndoe, backend=backend, response=response
        )
        self.assertEqual(social.social_id, response['id'])

    @parameterized.expand([
        ['twitter', twitter.TwitterOAuth, TWITTER]
    ])
    def test_create_social_multiple_users(self, name, backend, response):
        for user in [self.johndoe, self.foobar]:
            create_social(user=user, backend=backend, response=response)

        social = Social.objects.get(id=1)
        self.assertGreater(social.users.count(), 1)
