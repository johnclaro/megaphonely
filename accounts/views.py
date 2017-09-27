from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required

from social_django.models import UserSocialAuth

from contents.forms import ContentForm

@login_required
def user_profile(request):
    user = request.user

    try:
        twitter_login = user.social_auth.get(provider='twitter')
    except UserSocialAuth.DoesNotExist:
        twitter_login = None

    can_disconnect = (user.social_auth.count() >
                      1 or user.has_usable_password())

    form = ContentForm(request.POST or None)
    if form.is_valid():
        form.save()
        return redirect('user_profile', 'success')

    return render(request, 'accounts/user_profile.html', {
        'twitter_login': twitter_login,
        'can_disconnect': can_disconnect,
        'form': form
    })


def password(request):
    return 0
