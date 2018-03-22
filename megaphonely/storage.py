from django.conf import settings

from storages.backends.s3boto3 import S3Boto3Storage


class Static(S3Boto3Storage):
    location = settings.STATICFILES_LOCATION
    bucket_name = f"assets.{settings.AWS_STORAGE_BUCKET_NAME}"


class Media(S3Boto3Storage):
    location = settings.MEDIAFILES_LOCATION
    custom_domain = settings.AWS_S3_MEDIA_DOMAIN
