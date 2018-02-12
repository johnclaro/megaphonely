from .models import Social, SocialLink


def upsert(user=None, response=None, backend=None, **kwargs):
    if not user:
        raise ValueError('You must login first')

    name = 'linkedin' if 'linkedin-oauth2' == backend.name else backend.name
    social = Social.objects.upsert(name, response)
    social_link = SocialLink(account=user, social=social)
    social_link.save()
