from .models import Social

from django.contrib import messages


def upsert(user=None, response=None, backend=None, **kwargs):
    if not user:
        raise ValueError('You must login first')

    if 'linkedin' in backend.name:
        provider = 'linkedin'
    else:
        provider = backend.name

    max_socials_reached = Social.objects.upsert(provider, response, user)
    if max_socials_reached:
        message = """You have reached the maximum number of socials.
        Certain social accounts may not have been connected.
        """
        messages.add_message(kwargs['request'], messages.ERROR, message)
