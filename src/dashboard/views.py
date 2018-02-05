from django.http import HttpResponse
from django.template import loader
from django.contrib.auth.decorators import login_required

from src.socials.models import Social


@login_required
def dashboard_index(request):
    socials = Social.objects.filter(accounts=request.user.id).order_by('username')
    template = loader.get_template('dashboard.html')
    context = {'socials': socials}
    return HttpResponse(template.render(context, request))
