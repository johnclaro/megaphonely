import os

class Config(object):
    SECRET_KEY = os.environ['SECRET_KEY']
    SECURITY_REGISTERABLE = True
    SECURITY_RECOVERABLE = True
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    SQLALCHEMY_DATABASE_URI = os.environ['SQLALCHEMY_DATABASE_URI']
    SECURITY_PASSWORD_SALT = '12k3m1k2m3'

class Production(Config):
    SECRET_KEY = 'production'

class Development(Config):
    SECRET_KEY = 'development'
