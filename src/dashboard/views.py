from django.http import HttpResponse
from django.template import loader
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect

from src.accounts.models import Company, Social
from src.contents.models import Content


@login_required
def dashboard_index(request):
    companies = Company.objects.filter(accounts=request.user.id)
    if companies:
        # TODO: User should choose between active companies
        for c in companies:
            print(c)
        company = companies[0]
        socials = Social.objects.filter(company=company)
        contents = Content.objects.filter(company=company)
        template = loader.get_template('dashboard.html')
        context = {'company': company, 'socials': socials, 'contents': contents}
        return HttpResponse(template.render(context, request))
    else:
        return redirect('company-add')
