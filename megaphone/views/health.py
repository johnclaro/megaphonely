import os
from distutils.util import strtobool

from flask import Blueprint, render_template, jsonify
health = Blueprint('health', __name__, url_prefix='/health/')

@health.route('/')
def index():
    settings = {
        'DEBUG': bool(strtobool(os.environ['DEBUG'])),
        'PORT': int(os.environ['PORT']),
        'HOST': os.environ['HOST']
    }
    return jsonify(settings)
