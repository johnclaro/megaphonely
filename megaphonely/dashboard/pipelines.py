from .models import Social


def upsert(user=None, response=None, backend=None, **kwargs):
    if not user:
        raise ValueError('You must login first')

    print('YOU MADE ITTTTT YOU MADE ITTTTTYOU MADE ITTTTTYOU MADE ITTTTTYOU MADE ITTTTT')
    print(backend.name)
    print('YOU MADE ITTTTT YOU MADE ITTTTTYOU MADE ITTTTTYOU MADE ITTTTTYOU MADE ITTTTT')
    Social.objects.upsert(user, backend.name, response)
