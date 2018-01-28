import datetime

from twitter.models import Status
from parameterized import parameterized

from django.test import TestCase

from contents import tasks


class Tasks(TestCase):
    message = datetime.datetime.now().strftime('%Y-%m-%d-%s')
    image = 'http://www.catster.com/wp-content/uploads/2017/06/small-kitten-meowing.jpg'
    video = 'http://techslides.com/demos/sample-videos/small.mp4'

    @parameterized.expand([
        ['text', message, None],
        ['image', message, image],
        ['video', message, video]
    ])
    def test_publish_to_twitter(self, name, message, media):
        access_token_key = '901476753272655872-D2BwU3Z7vKJzv023g3gpBcdAfMBE1Ez'
        access_token_secret = 'oRnzSQ1eHMQBKot6R6QZdApn3wk6ZdarPo8FaKK0bWyzN'
        result = tasks.publish_to_twitter(access_token_key,
                                          access_token_secret,
                                          message,
                                          media=media)
        self.assertEqual(Status, type(result))