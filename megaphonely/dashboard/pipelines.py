from .models import Social

from django.contrib import messages


def upsert(user=None, response=None, backend=None, request=None, **kwargs):
    if not user:
        raise ValueError('You must login first')

    if 'linkedin' in backend.name:
        provider = 'linkedin'
    else:
        provider = backend.name

    capped, level, message = Social.objects.upsert(provider, response, user)
    if capped:
        messages.add_message(request, level, message)
