from facepy import GraphAPI

from django.db import models
from django.core.exceptions import ObjectDoesNotExist


def upsert_model(model, data):
    try:
        social = model.get(data['id'])
        for column, record in data.items():
            if social.__getattr__(column) == data[column]:
                social.__setattr__(social, column, record)
        social.save()
    except ObjectDoesNotExist:
        social = model.create(**data)

    return social


class SocialManager(models.Manager):

    def upsert(self, response):
        data = self._get_data(response)
        model = upsert_model(self, data)
        return model


class TwitterManager(SocialManager):

    def _get_data(self, data):
        return {
            'id': data['id'],
            'username': data['screen_name'],
            'fullname': data['name'],
            'picture_url': data['profile_image_url_https'],
            'access_token_key': data['access_token']['oauth_token'],
            'access_token_secret': data['access_token']['oauth_token_secret'],
        }


class FacebookManager(SocialManager):

    def _get_data(self, data):
        access_token_key = data['access_token']
        graph = GraphAPI(access_token_key)
        response = graph.get('me?fields=picture.width(640)')
        picture_url = response['picture']['data']['url']
        return {
            'id': data['id'],
            'username': data['id'],
            'fullname': data['name'],
            'picture_url': picture_url,
            'access_token_key': access_token_key,
        }
