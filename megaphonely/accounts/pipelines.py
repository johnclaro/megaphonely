from megaphonely.accounts.models import Social, Employee


def upsert(user=None, response=None, backend=None, request=None, **kwargs):
    if not user:
        raise ValueError('You must login first')

    company_id = int(request.COOKIES.get('active_company_id', 0))
    employee = Employee.objects.is_employed(company_id, user.id)
    Social.objects.upsert(employee.company, backend.name, response)
