import os

class Config(object):
    # sqlalchemy
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    SQLALCHEMY_DATABASE_URI = os.environ['SQLALCHEMY_DATABASE_URI']
    
    # flask-mail
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USE_SSL = False
    MAIL_USERNAME = os.environ['MAIL_USERNAME']
    MAIL_PASSWORD = os.environ['MAIL_PASSWORD']
    MAIL_DEFAULT_SENDER = f"'Megaphonely'"

    # flask-security
    SECURITY_CONFIRMABLE = True
    SECURITY_REGISTERABLE = True
    SECURITY_RECOVERABLE = True
    SECURITY_SEND_REGISTER_EMAIL= True
    SECURITY_USER_IDENTITY_ATTRIBUTES = ('username', 'email')
    SECURITY_EMAIL_SENDER = MAIL_DEFAULT_SENDER
    SECURITY_PASSWORD_SALT = '12k3m1k2m3'
    SECURITY_LOGIN_URL = '/signin'
    SECURITY_REGISTER_URL = '/signup'
    SECURITY_MSG_INVALID_PASSWORD = ("Bad username or password", "error")
    SECURITY_MSG_PASSWORD_NOT_PROVIDED = ("Bad username or password", "error")
    SECURITY_MSG_USER_DOES_NOT_EXIST = ("Bad username or password", "error")

    # python-social-auth
    SOCIAL_AUTH_USER_MODEL = 'megaphonely.models.User'
    SOCIAL_AUTH_STORAGE = 'social_flask_sqlalchemy.models.FlaskStorage'
    SOCIAL_AUTH_AUTHENTICATION_BACKENDS = (
        'social_core.backends.facebook.FacebookOAuth2',
    )
    SOCIAL_AUTH_FACEBOOK_KEY = os.environ['FACEBOOK_APP_ID']
    SOCIAL_AUTH_FACEBOOK_SECRET = os.environ['FACEBOOK_APP_SECRET']

class Production(Config):
    SECRET_KEY = os.environ['SECRET_KEY']

class Development(Config):
    SECRET_KEY = 'development'
    DATABASE='database.db'
