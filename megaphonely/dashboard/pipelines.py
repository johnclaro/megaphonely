from .models import Social


def upsert(user=None, response=None, backend=None, **kwargs):
    if not user:
        raise ValueError('You must login first')

    name = backend.name
    if 'linkedin' in name:
        name = 'linkedin'
    elif 'facebook' in name:
        name = 'facebook'

    social = Social.objects.upsert(name, response)
    social.accounts.add(user)
