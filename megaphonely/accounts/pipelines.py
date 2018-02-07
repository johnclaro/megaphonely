from megaphonely.accounts.models import Social, Employee


def upsert(user=None, response=None, backend=None, request=None, **kwargs):
    if not user:
        raise ValueError('You must login first')

    Social.objects.upsert(user, backend.name, response)
