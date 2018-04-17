from .models import Social

from django.contrib import messages
from django.utils import timezone


def upsert(user=None, response=None, backend=None, request=None, **kwargs):
    if not user:
        raise ValueError('You must login first')

    if not user.customer.ends_at < timezone.now():
        capped, level, message = Social.objects.upsert(
            backend.name, response, user
        )
        if capped:
            messages.add_message(request, level, message)
