from src.accounts.models import Social, Employee


def upsert(user=None, response=None, backend=None, request=None, **kwargs):
    if not user:
        raise ValueError('You must login first')

    active_company_id = int(request.COOKIES.get('active_company_id', 0))
    if not active_company_id:
        raise ValueError('You must select a company first')

    try:
        employee = Employee.objects.get(company__id=active_company_id,
                                        account__id=user.id)
        Social.objects.upsert(employee.company, backend.name, response)
    except Employee.DoesNotExist:
        raise ValueError('Company no longer exists')
