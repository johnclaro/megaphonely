from django.http import HttpResponse
from django.template import loader
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect

from src.accounts.models import Company, Social, Employee
from src.contents.models import Content


@login_required
def dashboard_index(request):
    companies = Company.objects.filter(accounts=request.user.id)
    if companies:
        employee = Employee.objects.get(company__in=companies,
                                        account=request.user,
                                        active=True)
        if employee:
            active_company = employee.company
            socials = Social.objects.filter(company=active_company)
            contents = Content.objects.filter(company=active_company)
            template = loader.get_template('dashboard.html')
            context = {
                'company': active_company,
                'socials': socials,
                'contents': contents
            }
            return HttpResponse(template.render(context, request))
        else:
            return redirect('company-list')
    else:
        return redirect('company-add')
