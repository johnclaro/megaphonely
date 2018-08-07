from django.shortcuts import render
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings

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

            msg = f"Thanks for signing up {payload['email']}!"
            subject = 'Megaphonely'
            html_message = """
                <img src='https://assets.megaphonely.com/static/email/megaphonely.png'>
                <strong>Thanks for joining the Megaphonely mailing list!</strong>
                <p>
                    You'll be updated on the latest developments of Megaphonely. Also, you can reply to this email if you want to suggest a feature or an idea that you'd like implemented.
                </p>
            """

            send_mail(
                subject=subject,
                message=html_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[payload['email']],
                html_message=html_message
            )
            messages.success(request, msg)
    else:
        form = CharlieForm()
    context = {'form': form}
    return render(request, 'landingpage/index.html', context)
