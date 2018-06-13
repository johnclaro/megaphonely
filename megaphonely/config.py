import os

class Config(object):
    SECRET_KEY = os.environ['SECRET_KEY']
    SECURITY_REGISTERABLE = True
    SECURITY_RECOVERABLE = True

class Production(Config):
    SECRET_KEY = 'production'

class Development(Config):
    SECRET_KEY = 'development'
