import ast

from django.template import loader
from django.contrib import messages
from django.http import HttpResponse

from .models import Social


def upsert(user=None, response=None, backend=None, request=None, **kwargs):
    if not user:
        raise ValueError('You must login first')

    data = Social.objects.get_data(backend.name, response)
    message = 'Successfully connected social account'
    if type(data) == list:
        template = loader.get_template('socials/prompt.html')
        context = {
            'socials': data
        }
        response = HttpResponse(template.render(context, request))
    else:
        Social.objects.upsert(data, user)
        messages.success(request, message)

    return response