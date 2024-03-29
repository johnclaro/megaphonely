from social_core.backends.facebook import FacebookOAuth2
from social_core.backends.linkedin import LinkedinOAuth2
from social_core.backends.instagram import InstagramOAuth2


class LinkedinOAuth2Company(LinkedinOAuth2):
    name = 'linkedin-oauth2-company'


class FacebookOAuth2Page(FacebookOAuth2):
    name = 'facebook-page'


class FacebookOAuth2Group(FacebookOAuth2):
    name = 'facebook-group'


class InstagramOAuth2Business(InstagramOAuth2):
    name = 'instagram-business'
