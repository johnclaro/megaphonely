from django.db import models
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator

from facepy import GraphAPI
from linkedin import linkedin


class ContentManager(models.Manager):

    def get_user_contents(self, user, page=None):
        contents = self.filter(
            account=user,
            schedule='date',
            is_published=False,
            schedule_at__gte=timezone.now()
        ).order_by('schedule_at')
        if page:
            paginator = Paginator(contents, 5)
            contents = paginator.get_page(page)

        return contents

    def content_plan_limit_exceeded(self, user):
        content_plan_limit_exceeded = False
        contents = self.get_user_contents(user, 1)

        if user.customer.subscription.plan.contents <= contents.paginator.count:
            content_plan_limit_exceeded = True

        return content_plan_limit_exceeded


class SocialManager(models.Manager):

    def get_latest_user_socials(self, user):
        socials = self.filter(account=user).order_by('-updated_at')

        return socials

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
            'category': 'profile'
        }

        return data

    def _get_linkedin_data(self, data):
        username = data['publicProfileUrl'].rsplit('/', 1)[-1]
        access_token_key = data['access_token']
        social_id = data['id']
        picture_url = data.get('pictureUrl', '')

        data = {
            'social_id': social_id,
            'provider': 'linkedin',
            'username': username,
            'url': f'https://www.linkedin.com/in/{username}',
            'picture_url': picture_url,
            'fullname': f"{data['firstName']} {data['lastName']}",
            'access_token_key': access_token_key,
            'category': 'profile'
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
            except (linkedin.LinkedInError, KeyError):
                company['picture_url'] = ''

            companies.append(company)

        return companies

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
            'category': 'profile'
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

    def _get_instagram_data(self, data):
        username = data['user']['username']
        category = 'business' if data['user']['is_business'] else 'profile'
        data = {
            'social_id': data['user']['id'],
            'provider': 'instagram',
            'username': username,
            'fullname': data['user']['full_name'],
            'url': f'https://www.instagram.com/{username}',
            'picture_url': data['user']['profile_picture'],
            'access_token_key': data['access_token'],
            'category': category
        }

        return data

    def _get_instagram_business_data(self, data):
        return self._get_instagram_data(data)

    def get_data(self, provider, data):
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
        elif provider == 'instagram':
            data = self._get_instagram_data(data)
        elif provider == 'instagram-business':
            data = self._get_instagram_business_data(data)

        return data

    def update(self, data, user):
        social = self.get(
            social_id=data['social_id'], provider=data['provider'],
            category=data['category'], account=user,
        )
        updated = False
        for column, record in data.items():
            if social.__getattribute__(column) != data[column]:
                social.__setattr__(column, record)
                updated = True
        if updated:
            social.save()

        return social

    def upsert(self, data, user):
        try:
            social = self.update(data, user)
        except ObjectDoesNotExist:
            social = self.create(**data, account=user)

        return social
