import logging

from django.template import loader
from django.http import HttpResponse
from django.shortcuts import redirect
from django.contrib.auth.decorators import login_required

from megaphonely.contents.models import Content
from megaphonely.accounts.models import Company, Social, Employee

logger = logging.getLogger(__name__)


@login_required
def dashboard_index(request):
    companies = Company.objects.filter(accounts=request.user).count()
    logger.debug('Got {companies} companies for {user}'.format(
            companies=companies, user=request.user
    ))
    if not companies:
        logger.warning('No companies found, redirecting user to create one')
        return redirect('company-add')

    active_company_id = int(request.COOKIES.get('active_company_id', 0))
    logger.debug('Got active company id: {active_company_id}'.format(
        active_company_id=active_company_id
    ))
    if not active_company_id:
        logger.warning('No active company found, redirecting user to choose one')
        return redirect('company-list')

    try:
        employee = Employee.objects.get(company__id=active_company_id,
                                        account__id=request.user.id)
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
    except Employee.DoesNotExist:
        logger.warning('Employee no longer in company, choosing another one')
        response = redirect('company-list')
        response.set_cookie('active_company_id', 0)
        return response
