from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, SQLAlchemyUserDatastore

db = SQLAlchemy()
security = Security()

def create_app(config):
    app = Flask(__name__)

    db.init_app(app)
    from .models import User, Role
    users = SQLAlchemyUserDatastore(db, User, Role)
    security.init_app(app, users)

    from .views.home import home
    from .views.account import account
    app.register_blueprint(home)
    app.register_blueprint(account)

    return app
