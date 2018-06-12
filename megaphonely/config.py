import os

class Config(object):
    SECRET_KEY = os.environ['SECRET_KEY']
    SECURITY_REGISTERABLE = True

class Prd(Config):
    SECRET_KEY = 'production'

class Dev(Config):
    SECRET_KEY = 'development'
