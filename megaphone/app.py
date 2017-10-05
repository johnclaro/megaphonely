import os
from distutils.util import strtobool

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['SQLALCHEMY_DATABASE_URI']
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = bool(strtobool(os.environ['SQLALCHEMY_TRACK_MODIFICATIONS']))
    app.config['DEBUG'] = bool(strtobool(os.environ['DEBUG']))
    app.config['PORT'] = int(os.environ['PORT'])
    app.config['HOST'] = os.environ['HOST']

    db = SQLAlchemy()

    db.init_app(app)

    from views.admin import admin
    from views.home import home
    app.register_blueprint(admin)
    app.register_blueprint(home)

    return app
