from .models import Twitter, Facebook


def social_upsert(user=None, response=None, backend=None, **kwargs):
    if not user:
        raise ValueError('You must login first')

    backends = {
        'twitter': Twitter,
        'facebook': Facebook
    }

    try:
        backends[backend.name].objects.upsert(user, response)
    except KeyError:
        raise NotImplementedError(
            "{backend} is not implemented".format(backend=backend.name)
        )
