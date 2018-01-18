from django.contrib.auth.models import User

from allauth.account.models import EmailAddress
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter


class SocialAccountAdapter(DefaultSocialAccountAdapter):
    def pre_social_login(self, request, sociallogin):
        """
        Invoked just after a user successfully authenticates via a
        social provider, but before the login is actually processed
        (and before the pre_social_login signal is emitted).

        We're trying to solve different use cases:
        - social account already exists, just go on
        - social account has no email or email is unknown, just go on
        - social account's email exists, link social account to existing user
        """
        print('Reqqqqqqqq')
        print(request.user)
        print('Ueeeeeesst')

        # Ignore existing social accounts, just do this stuff for new ones
        if sociallogin.is_existing:
            print('Already existed!')
            return

        print('Connecting {user}'.format(user=request.user))
        sociallogin.connect(request, request.user)
