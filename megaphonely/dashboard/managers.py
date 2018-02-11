from django.db import models
from django.core.exceptions import ObjectDoesNotExist

from facepy import GraphAPI
from linkedin import linkedin


class ContentManager(models.Manager):
    pass


class SocialManager(models.Manager):

    def _get_linkedin_data(self, data):
        username = data['publicProfileUrl'].rsplit('/', 1)[-1]
        access_token_key = data['access_token']
        application = linkedin.LinkedInApplication(token=access_token_key)
        social_id = data['id']
        picture_url = application.get_picture_urls()['values'][0]
        return {
            'social_id': social_id,
            'provider': 'linkedin',
            'username': username,
            'url': f'https://www.linkedin.com/in/{username}',
            'picture_url': picture_url,
            'fullname': f"{data['firstName']} {data['lastName']}",
            'access_token_key': access_token_key
        }

    def _get_twitter_data(self, data):
        username = data['screen_name']
        return {
            'social_id': data['id'],
            'provider': 'twitter',
            'username': username,
            'fullname': data['name'],
            'url': f'https://www.twitter.com/{username}',
            'picture_url': data['profile_image_url_https'],
            'access_token_key': data['access_token']['oauth_token'],
            'access_token_secret': data['access_token']['oauth_token_secret'],
        }

    def _get_facebook_data(self, data):
        access_token_key = data['access_token']
        graph = GraphAPI(access_token_key)
        response = graph.get('me?fields=picture.width(640)')
        picture_url = response['picture']['data']['url']
        username = data['id']
        return {
            'social_id': username,
            'provider': 'facebook',
            'username': username,
            'fullname': data['name'],
            'url': f'https://www.facebook.com/{username}',
            'picture_url': picture_url,
            'access_token_key': access_token_key,
        }

    def _get_data(self, provider, data):
        if provider == 'twitter':
            data = self._get_twitter_data(data)
        elif provider == 'facebook':
            data = self._get_facebook_data(data)
        elif provider == 'linkedin':
            data = self._get_linkedin_data(data)

        return data

    def _create_or_update(self, account, provider, data):
        updated = False
        try:
            social = self.get(social_id=data['social_id'], provider=provider)
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

    def upsert(self, account, provider, response):
        data = self._get_data(provider, response)
        model = self._create_or_update(account, provider, data)
        return model
