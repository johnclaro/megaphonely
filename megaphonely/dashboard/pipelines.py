from .models import Social


def upsert(user=None, response=None, backend=None, **kwargs):
    if not user:
        raise ValueError('You must login first')

    number_of_socials = Social.objects.filter(account=user).count()
    if 'linkedin' in backend.name:
        provider = 'linkedin'
    else:
        provider = backend.name

    Social.objects.upsert(provider, response, user)
