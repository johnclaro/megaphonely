from contents.tasks import add

from django.test import TestCase


class Tasks(TestCase):

    def test_add(self):
        result = add(1, 2)
        self.assertEqual(result, add(1, 2))
