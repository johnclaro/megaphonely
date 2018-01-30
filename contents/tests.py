import datetime

from twitter.models import Status
from parameterized import parameterized

from django.test import TestCase

from contents import tasks


class Tasks(TestCase):
    MESSAGE = datetime.datetime.now().strftime('%Y-%m-%d-%s')
    IMAGE_URL = 'http://www.catster.com/wp-content/uploads/2017/06/small-kitten-meowing.jpg'
    VIDEO_URL = 'http://techslides.com/demos/sample-videos/small.mp4'
    IMAGE_FILENAME = 'small-kitten-meowing.jpg'
    VIDEO_FILENAME = 'small.mp4'

    # @parameterized.expand([
    #     ['text', None],
    #     ['image', IMAGE_URL],
    #     ['video', VIDEO_URL]
    # ])
    # def test_publish_to_twitter(self, name, media):
    #     access_token_key = '901476753272655872-D2BwU3Z7vKJzv023g3gpBcdAfMBE1Ez'
    #     access_token_secret = 'oRnzSQ1eHMQBKot6R6QZdApn3wk6ZdarPo8FaKK0bWyzN'
    #     result = tasks.publish_to_twitter(access_token_key,
    #                                       access_token_secret,
    #                                       self.MESSAGE,
    #                                       media=media)
    #     self.assertEqual(Status, type(result))

    @parameterized.expand([
        # ['text', None],
        # ['image', IMAGE_URL],
        ['video', VIDEO_FILENAME]
    ])
    def test_publish_to_facebook(self, name, media):
        data = {name: media}
        try:
            del data['text']
        except KeyError:
            pass

        access_token_key = 'EAAY8CZCqoStABAFN1RHBA0DBcBDX4NGXZB5l6EbjXGucQZC5ybSJkeRaGfiUuMcElrJj9Wx7e6MGNtPIZBwWZAtASPBZBYFHw2slxYApRl8zzyR57dQEDZBZCkc1ohUBDsTCwSgscJaXVNlxcsJzwQdLKYkbdTUS9kZBlHhq0cTpwXAZDZD'
        result = tasks.publish_to_facebook(access_token_key,
                                           self.MESSAGE,
                                           **data)
        self.assertEqual(dict, type(result))
