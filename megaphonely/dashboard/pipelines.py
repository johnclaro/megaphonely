from .models import Social


def upsert(user=None, response=None, backend=None, **kwargs):
    if not user:
        raise ValueError('You must login first')

    name = 'linkedin' if 'linkedin' in backend.name else backend.name
    Social.objects.upsert(user, name, response)
