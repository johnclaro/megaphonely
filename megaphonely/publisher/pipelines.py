from django.template import loader
from django.contrib import messages
from django.http import HttpResponse

from .models import Social


def upsert(**kwargs):
    user = kwargs['user']
    response = kwargs['response']
    backend = kwargs['backend']
    request = kwargs['request']

    if not user:
        raise ValueError('You must login first')

    data = Social.objects.get_data(backend.name, response)
    if type(data) == list:
        template = loader.get_template('socials/prompt.html')
        context = {
            'socials': data
        }
        response = HttpResponse(template.render(context, request))
    else:
        Social.objects.upsert(data, user)
        message = 'Successfully connected social account'
        messages.success(request, message)

    return response
