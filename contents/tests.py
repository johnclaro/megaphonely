import datetime

from twitter.models import Status

from django.test import TestCase

from contents.tasks import publish_content_to_twitter


class Tasks(TestCase):

    def test_publish_content_to_twitter(self):
        access_token_key = '901476753272655872-K8eWjpaTwj0OyyQcPwz9PXdRv0DZVls'
        access_token_secret = 'CcucxBFJq3fn8EX8brGNpwZ1e2uIuzxX5sWolGQRCywMJ'
        message = datetime.datetime.now().strftime('%Y-%m-%d-%s')
        result = publish_content_to_twitter(access_token_key,
                                            access_token_secret,
                                            message)
        self.assertEqual(Status, type(result))
