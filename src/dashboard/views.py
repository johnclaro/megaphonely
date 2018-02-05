from django.http import HttpResponse
from django.template import loader
from django.contrib.auth.decorators import login_required

from src.accounts.models import Social
from src.contents.models import Content


@login_required
def dashboard_index(request):
    socials = Social.objects.filter(accounts=request.user.id).order_by('username')
    contents = Content.objects.filter(account=request.user.id)
    template = loader.get_template('dashboard.html')
    context = {'socials': socials, 'contents': contents}
    return HttpResponse(template.render(context, request))
