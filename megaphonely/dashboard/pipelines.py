from .models import Social

from django.contrib import messages
from django.utils import timezone
from django.utils.safestring import mark_safe


def upsert(user=None, response=None, backend=None, request=None, **kwargs):
    if not user:
        raise ValueError('You must login first')

    if 'linkedin' in backend.name:
        provider = 'linkedin'
    else:
        provider = backend.name

    if user.trial.ends_at < timezone.now():
        level = messages.ERROR
        message = mark_safe("""Your trial has expired but you can still
        <a href='mailto:support@megaphonely.com?subject=Extend%20trial'>contact us</a>
        if you would still like to extend. We also appreciate feedback
        if you could include it in your email!
        """)
        capped = True
    else:
        capped, level, message = Social.objects.upsert(provider, response, user)

    if capped:
        messages.add_message(request, level, message)
