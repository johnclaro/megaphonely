from allauth.socialaccount.adapter import DefaultSocialAccountAdapter


class SocialAccountAdapter(DefaultSocialAccountAdapter):

    def pre_social_login(self, request, social_account):
        if social_account.is_existing or request.user.is_anonymous:
            return
        else:
            social_account.connect(request, request.user)
