from django.shortcuts import render
from django.contrib import messages

from .models import Charlie
from .forms import CharlieForm


def index(request):
    if request.method == 'POST':
        form = CharlieForm(request.POST)
        if form.is_valid():
            payload = request.POST
            charlie = Charlie(
                email=payload['email'],
                kind=payload['kind'],
                category=payload['category']
            )
            charlie.save()
            messages.success(request, 'Thanks for signing up!')
    else:
        form = CharlieForm()
    context = {'form': form}
    return render(request, 'landingpage/index.html', context)


def signup(request):
    if request.method == 'POST':
        payload = request.POST
        charlie = Charlie(
            email=payload['email'],
            kind=payload['kind'],
            category=payload['category']
        )
        charlie.save()
    return render(request, 'landingpage/index.html')
