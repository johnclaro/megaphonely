import os

class Config(object):
    SECRET_KEY = os.environ['SECRET_KEY']

    # sqlalchemy
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    SQLALCHEMY_DATABASE_URI = os.environ['SQLALCHEMY_DATABASE_URI']

    # flask-security
    SECURITY_CONFIRMABLE = True
    SECURITY_REGISTERABLE = True
    SECURITY_RECOVERABLE = True
    SECURITY_USER_IDENTITY_ATTRIBUTES = ('username', 'email')
    SECURITY_PASSWORD_SALT = '12k3m1k2m3'
    SECURITY_LOGIN_URL = '/signin'
    SECURITY_REGISTER_URL = '/signup'
    SECURITY_MSG_INVALID_PASSWORD = ("Bad username or password", "error")
    SECURITY_MSG_PASSWORD_NOT_PROVIDED = ("Bad username or password", "error")
    SECURITY_MSG_USER_DOES_NOT_EXIST = ("Bad username or password", "error")

class Production(Config):
    SECRET_KEY = 'production'

class Development(Config):
    SECRET_KEY = 'development'
