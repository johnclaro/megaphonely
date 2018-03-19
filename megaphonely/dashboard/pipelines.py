from .models import Social


def upsert(user=None, response=None, backend=None, **kwargs):
    if not user:
        raise ValueError('You must login first')

    provider = backend.name if 'linkedin' not in backend.name else 'linkedin'
    Social.objects.upsert(provider, response, user)
