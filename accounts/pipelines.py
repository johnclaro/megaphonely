from .models import Twitter, Facebook


def social_upsert(user=None, response=None, backend=None, **kwargs):
    if not user:
        raise ValueError('You must login first')

    providers = {
        'twitter': Twitter,
        'facebook': Facebook
    }

    if backend.name in providers.keys():
        providers[backend.name].objects.upsert(response)
    else:
        raise NotImplementedError(
            "{provider} is not implemented".format(provider=backend.name)
        )
