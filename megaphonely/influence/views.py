from django.shortcuts import render


def index(request):
    if not request.user.is_authenticated:
        response = render(request, 'home/index.html')
    else:
        response = render(request, 'influence/index.html')

    return response