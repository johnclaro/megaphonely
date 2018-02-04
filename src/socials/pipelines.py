from .models import Twitter, Facebook


def upsert(user=None, response=None, backend=None, **kwargs):
    if not user:
        raise ValueError('You must login first')

    backends = {'twitter': Twitter, 'facebook': Facebook}

    try:
        backends[backend.name].objects.upsert(user, response)
    except KeyError:
        raise NotImplementedError(f"{backend.name} is not implemented")
