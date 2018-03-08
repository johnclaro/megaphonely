import os
import sys
import logging
from distutils.util import strtobool

import stripe

from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Django
DEBUG = bool(strtobool(os.environ['DEBUG']))
SECRET_KEY = os.environ['SECRET_KEY']
STATIC_URL = '/static/'
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
MEDIA_ROOT = os.path.join(BASE_DIR, 'static')
ROOT_URLCONF = 'megaphonely.urls'
WSGI_APPLICATION = 'megaphonely.wsgi.application'
AUTH_USER_MODEL = 'auth.User'
LOGIN_URL = '/login'
LOGIN_REDIRECT_URL = '/'

# Email
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = os.environ['EMAIL_HOST_USER']
EMAIL_HOST_PASSWORD = os.environ['EMAIL_HOST_PASSWORD']
EMAIL_PORT = 587

if DEBUG:
    ALLOWED_HOSTS = ('megaphonely.localhost',)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }
else:
    SECURE_HSTS_SECONDS = 1
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_SSL_REDIRECT = True
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    X_FRAME_OPTIONS = 'DENY'
    SECURE_HSTS_PRELOAD = True
    ALLOWED_HOSTS = ('www.megaphonely.com', 'megaphonely.com')
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ['RDS_DATABASE'],
            'USER': os.environ['RDS_USERNAME'],
            'PASSWORD': os.environ['RDS_PASSWORD'],
            'HOST': os.environ['RDS_HOST'],
            'PORT': 5432
        }
    }
    # Used by storage
    STATICFILES_STORAGE = 'megaphonely.storage.Static'
    STATICFILES_LOCATION = 'static'
    MEDIAFILES_LOCATION = 'media'
    DEFAULT_FILES_STORAGE = 'megaphonely.storage.Media'

# Social Auth
SOCIAL_AUTH_TWITTER_KEY = os.environ['TWITTER_CONSUMER_KEY']
SOCIAL_AUTH_TWITTER_SECRET = os.environ['TWITTER_CONSUMER_SECRET']
SOCIAL_AUTH_FACEBOOK_KEY = os.environ['FACEBOOK_APP_ID']
SOCIAL_AUTH_FACEBOOK_SECRET = os.environ['FACEBOOK_APP_SECRET']
SOCIAL_AUTH_FACEBOOK_SCOPE = ['public_profile', 'email', 'publish_actions']
SOCIAL_AUTH_FACEBOOK_PAGE_KEY = os.environ['FACEBOOK_APP_ID']
SOCIAL_AUTH_FACEBOOK_PAGE_SECRET = os.environ['FACEBOOK_APP_SECRET']
SOCIAL_AUTH_FACEBOOK_PAGE_SCOPE = [
    'public_profile', 'email', 'publish_actions', 'manage_pages',
    'publish_pages'
]
SOCIAL_AUTH_FACEBOOK_GROUP_KEY = os.environ['FACEBOOK_APP_ID']
SOCIAL_AUTH_FACEBOOK_GROUP_SECRET = os.environ['FACEBOOK_APP_SECRET']
SOCIAL_AUTH_FACEBOOK_GROUP_SCOPE = [
    'public_profile', 'email', 'publish_actions', 'manage_pages',
    'publish_pages', 'user_managed_groups'
]
SOCIAL_AUTH_LINKEDIN_OAUTH2_KEY = os.environ['LINKEDIN_CLIENT_ID']
SOCIAL_AUTH_LINKEDIN_OAUTH2_SECRET = os.environ['LINKEDIN_CLIENT_SECRET']
SOCIAL_AUTH_LINKEDIN_OAUTH2_SCOPE = [
    'r_basicprofile', 'r_emailaddress', 'w_share'
]
SOCIAL_AUTH_LINKEDIN_OAUTH2_FIELD_SELECTORS = ['public-profile-url']
SOCIAL_AUTH_LINKEDIN_OAUTH2_EXTRA_DATA = [
    ('publicProfileUrl', 'public_profile_url'),
]
SOCIAL_AUTH_LINKEDIN_OAUTH2_COMPANY_KEY = os.environ['LINKEDIN_CLIENT_ID']
SOCIAL_AUTH_LINKEDIN_OAUTH2_COMPANY_SECRET = os.environ['LINKEDIN_CLIENT_SECRET']
SOCIAL_AUTH_LINKEDIN_OAUTH2_COMPANY_SCOPE = [
    'r_basicprofile', 'r_emailaddress', 'rw_company_admin', 'w_share'
]
SOCIAL_AUTH_LINKEDIN_OAUTH2_COMPANY_FIELD_SELECTORS = ['public-profile-url']
SOCIAL_AUTH_LINKEDIN_OAUTH2_COMPANY_EXTRA_DATA = [
    ('publicProfileUrl', 'public_profile_url'),
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# AWS
AWS_S3_REGION_NAME = os.environ['AWS_S3_REGION_NAME']
AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
AWS_STORAGE_BUCKET_NAME = os.environ['AWS_STORAGE_BUCKET_NAME']
AWS_S3_CUSTOM_DOMAIN = os.environ['AWS_S3_CUSTOM_DOMAIN']

# Allauth
SITE_ID = 1
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'
ACCOUNT_LOGOUT_ON_GET = True
ACCOUNT_AUTHENTICATION_METHOD = 'username_email'
ACCOUNT_SIGNUP_PASSWORD_ENTER_TWICE = False
ACCOUNT_LOGIN_ON_PASSWORD_RESET = True
ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION = True
ACCOUNT_LOGOUT_ON_PASSWORD_CHANGE = True
ACCOUNT_SESSION_REMEMBER = True

# Crispy forms
CRISPY_TEMPLATE_PACK = 'bootstrap4'

# Stripe
STRIPE_PLANS = {
    'standard': {
        'id': 'standard-plan-1',
        'price': '19',
        'priority': 1
    },
    'advanced': {
        'id': 'advanced-plan-1',
        'price': '49',
        'priority': 2
    }
}
STRIPE_PUBLIC_KEY = os.environ['STRIPE_PUBLIC_KEY']
STRIPE_SECRET_KEY = os.environ['STRIPE_SECRET_KEY']
stripe.api_key = STRIPE_SECRET_KEY


INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',
    'debug_toolbar',
    'megaphonely.accounts',
    'megaphonely.dashboard',
    'megaphonely.billing',
    'storages',
    'social_django',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'crispy_forms',
    'widget_tweaks',
)

MIDDLEWARE = (
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'debug_toolbar.middleware.DebugToolbarMiddleware',
)

TEMPLATES = (
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'megaphonely/templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': (
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'social_django.context_processors.backends',
                'social_django.context_processors.login_redirect',
            ),
        },
    },
)

AUTH_PASSWORD_VALIDATORS = (
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
)

AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
    'social_core.backends.twitter.TwitterOAuth',
    'social_core.backends.facebook.FacebookOAuth2',
    'social_core.backends.linkedin.LinkedinOAuth2',
    'megaphonely.dashboard.backends.FacebookOAuth2Page',
    'megaphonely.dashboard.backends.FacebookOAuth2Group',
    'megaphonely.dashboard.backends.LinkedinOAuth2Company'
)

AWS_S3_OBJECT_PARAMETERS = {
    'CacheControl': 'max-age=0',
}

SOCIAL_AUTH_PIPELINE = (
    'social_core.pipeline.social_auth.social_details',
    'social_core.pipeline.social_auth.social_uid',
    'social_core.pipeline.social_auth.social_user',
    'social_core.pipeline.user.get_username',
    'megaphonely.dashboard.pipelines.upsert',
)

INTERNAL_IPS = ('127.0.0.1',)

logging.basicConfig(stream=sys.stdout, level=logging.INFO)
