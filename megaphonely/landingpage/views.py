from django.shortcuts import render


def signup(request):
    context = {}
    template = 'landingpage/index.html'
    response = render(request, template, context)

    return response
