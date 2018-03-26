from django.shortcuts import render


def handle_404(request, exception):
    return render(request, '404.html', {})


def handle_500(request, exception):
    return render(request, '500.html', {})
