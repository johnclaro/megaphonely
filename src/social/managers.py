from facepy import GraphAPI

from django.db import models
from django.core.exceptions import ObjectDoesNotExist


class Social(models.Manager):

    def _create_or_update(self, account, data):
        updated = False
        try:
            social = self.get(id=data['id'])
            for column, record in data.items():
                if social.__getattribute__(column) != data[column]:
                    social.__setattr__(column, record)
                    updated = True
            if updated:
                social.save()
        except ObjectDoesNotExist:
            social = self.create(**data)
        social.accounts.add(account)
        return social

    def upsert(self, account, response):
        data = self._get_data(response)
        model = self._create_or_update(account, data)
        return model


class Twitter(Social):

    def _get_data(self, data):
        return {
            'id': data['id'],
            'username': data['screen_name'],
            'fullname': data['name'],
            'picture_url': data['profile_image_url_https'],
            'access_token_key': data['access_token']['oauth_token'],
            'access_token_secret': data['access_token']['oauth_token_secret'],
        }


class Facebook(Social):

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
