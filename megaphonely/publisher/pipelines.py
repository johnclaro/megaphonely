import json

from django.template import loader
from django.contrib import messages
from django.http import HttpResponse

from .models import Social


def upsert(user=None, response=None, backend=None, request=None, **kwargs):
    if not user:
        raise ValueError('You must login first')

    data = Social.objects.get_data(backend.name, response)
    message = "Successfully connected social account"
    if type(data) == list:
        # template = loader.get_template('socials/choose.html')
        # context = {'prompts': data}
        # prompt_response = HttpResponse(template.render(context, request))
        # return prompt_response
        for d in data:
            Social.objects.upsert(d, user)
        messages.success(request, f"{message}(s)")
    else:
        Social.objects.upsert(data, user)
        messages.success(request, message)

