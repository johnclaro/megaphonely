from django.shortcuts import render

from .forms import CharlieForm


def index(request):
    form = CharlieForm()
    context = {'form': form}
    return render(request, 'landingpage/index.html', context)


def signup(request):
    return render(request, 'landingpage/index.html')
