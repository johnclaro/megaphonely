from django.db import models
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings
from django.contrib import messages
from django.utils import timezone

from facepy import GraphAPI
from linkedin import linkedin


class ContentManager(models.Manager):
    pass

    def reached_max_contents(self, user):
        current_number_of_contents = self.filter(
            account=user, schedule='custom', is_published=False
        ).count()
        max_contents = settings.STRIPE_PLANS[user.customer.plan]['contents']

        return current_number_of_contents >= max_contents

    def get_scheduled_today(self, user):
        contents = self.filter(
            editor=user, schedule='custom', is_published=False,
            schedule_at__date=timezone.now().today()
        ).order_by('schedule_at')

        return contents

    def get_scheduled_yesterday(self, user):
        contents = self.filter(
            editor=user, schedule='custom', is_published=False,
            schedule_at__date__lt=timezone.now().today()
        ).order_by('schedule_at')

        return contents


class SocialManager(models.Manager):

    def reached_max_socials(self, user):
        current_number_of_socials = self.filter(account=user).count()
        max_socials = settings.STRIPE_PLANS[user.customer.plan]['socials']

        return current_number_of_socials >= max_socials

    def _get_linkedin_data(self, data):
        username = data['publicProfileUrl'].rsplit('/', 1)[-1]
        access_token_key = data['access_token']
        application = linkedin.LinkedInApplication(token=access_token_key)
        social_id = data['id']
        try:
            picture_url = application.get_picture_urls()['values'][0]
        except (KeyError, TypeError):
            picture_url = ''

        data = {
            'social_id': social_id,
            'provider': 'linkedin',
            'username': username,
            'url': f'https://www.linkedin.com/in/{username}',
            'picture_url': picture_url,
            'fullname': f"{data['firstName']} {data['lastName']}",
            'access_token_key': access_token_key
        }

        return data

    def _get_linkedin_company_data(self, data):
        access_token_key = data['access_token']
        application = linkedin.LinkedInApplication(token=access_token_key)
        response = application.get_companies(
            selectors=['id', 'name', 'universal-name'],
            params={'is-company-admin': 'true'}
        )
        values = response['values']

        companies = []
        for index, value in enumerate(values):
            company_id = value['id']
            universal_name = value['universalName']
            company = {
                'social_id': company_id,
                'provider': 'linkedin',
                'username': universal_name,
                'url': f'https://www.linkedin.com/company/{universal_name}',
                'fullname': value['name'],
                'access_token_key': access_token_key,
                'category': 'company'
            }

            try:
                company_response = application.get_companies(
                    selectors=['logo-url'],
                    params={'is-company-admin': 'true'}
                )
                logo_url = company_response['values'][index]['logoUrl']
                company['picture_url'] = logo_url

                # Returns error below when company page has no logo
            except linkedin.LinkedInError:
                company['picture_url'] = ''

            companies.append(company)

        return companies

    def _get_twitter_data(self, data):
        username = data['screen_name']
        data = {
            'social_id': data['id'],
            'provider': 'twitter',
            'username': username,
            'fullname': data['name'],
            'url': f'https://www.twitter.com/{username}',
            'picture_url': data['profile_image_url_https'],
            'access_token_key': data['access_token']['oauth_token'],
            'access_token_secret': data['access_token']['oauth_token_secret'],
        }

        return data

    def _get_facebook_data(self, data, entity='me'):
        access_token_key = data['access_token']
        graph = GraphAPI(access_token_key)
        response = graph.get(f'{entity}?fields=picture.width(640)')
        picture_url = response['picture']['data']['url']
        username = data['id']
        data = {
            'social_id': username,
            'provider': 'facebook',
            'username': username,
            'fullname': data['name'],
            'url': f'https://www.facebook.com/{username}',
            'picture_url': picture_url,
            'access_token_key': access_token_key,
        }

        return data

    def _get_facebook_page_data(self, data):
        access_token_key = data['access_token']
        graph = GraphAPI(access_token_key)
        me_accounts = graph.get('me/accounts')['data']

        pages = []
        for me_account in me_accounts:
            data = self._get_facebook_data(me_account)
            data['category'] = 'page'
            pages.append(data)

        return pages

    def _get_facebook_group_data(self, data):
        access_token_key = data['access_token']
        graph = GraphAPI(access_token_key)
        groups_data = graph.get('me/groups')['data']

        groups = []
        for group_data in groups_data:
            group_data['access_token'] = access_token_key
            group = self._get_facebook_data(group_data, entity=data['id'])
            group['fullname'] = f"{group_data['name']} (as {data['name']})"
            group['category'] = 'group'
            groups.append(group)

        return groups

    def _get_data(self, provider, data):
        if provider == 'twitter':
            data = self._get_twitter_data(data)
        elif provider == 'facebook':
            data = self._get_facebook_data(data)
        elif provider == 'facebook-page':
            data = self._get_facebook_page_data(data)
        elif provider == 'facebook-group':
            data = self._get_facebook_group_data(data)
        elif provider == 'linkedin-oauth2':
            data = self._get_linkedin_data(data)
        elif provider == 'linkedin-oauth2-company':
            data = self._get_linkedin_company_data(data)

        return data

    def update(self, provider, data, user):
        social = self.get(
            social_id=data['social_id'], provider=provider, account=user
        )
        updated = False
        for column, record in data.items():
            if social.__getattribute__(column) != data[column]:
                social.__setattr__(column, record)
                updated = True
        if updated:
            social.save()

        return social

    def _create_or_update(self, provider, data, user):
        try:
            social = self.update(provider, data, user)
        except ObjectDoesNotExist:
            social = self.create(**data, account=user)

        return social

    def upsert(self, provider, response, user):
        capped = False
        level = None
        message = ''

        if self.reached_max_socials(user):
            level = messages.ERROR
            message = """Social account not connected because you have reached
            the maximum number of connectable social accounts allowed."""
            capped = True
        else:
            data = self._get_data(provider, response)
            if type(data) != dict:
                for d in data:
                    if not self.reached_max_socials(user):
                        self._create_or_update(d['provider'], d, user)
                    else:
                        capped = True
                        level = messages.WARNING
                        message = """While connecting your social account(s)
                        you have reached the maximum number of connectable
                        social accounts allowed. Certain social accounts may
                        not have been connected.
                        """
                        break
            else:
                self._create_or_update(provider, data, user)

        return capped, level, message


class TeamManager(models.Manager):
    pass