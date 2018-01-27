import datetime

from twitter.models import Status
from parameterized import parameterized

from django.test import TestCase

from contents.tasks import publish_content_to_twitter


class Tasks(TestCase):
    image = 'http://www.catster.com/wp-content/uploads/2017/06/small-kitten-meowing.jpg'
    video = 'http://techslides.com/demos/sample-videos/small.mp4'

    @parameterized.expand([
        ['text', None],
        ['image', image],
        ['video', video]
    ])
    def test_publish_content_to_twitter(self, name, media):
        access_token_key = '901476753272655872-K8eWjpaTwj0OyyQcPwz9PXdRv0DZVls'
        access_token_secret = 'CcucxBFJq3fn8EX8brGNpwZ1e2uIuzxX5sWolGQRCywMJ'
        message = datetime.datetime.now().strftime('%Y-%m-%d-%s')
        result = publish_content_to_twitter(access_token_key,
                                            access_token_secret,
                                            message,
                                            media=media)
        self.assertEqual(Status, type(result))
