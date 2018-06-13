import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, SQLAlchemyUserDatastore
from flask_migrate import Migrate
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView

from .forms import ExtendedRegisterForm

db = SQLAlchemy()
security = Security(register_form=ExtendedRegisterForm)
migrate = Migrate()
admin = Admin(name='Megaphonely', template_mode='bootstrap3')

def create_app():
    app = Flask(__name__)
    config = 'megaphonely.config.Development' if os.environ['FLASK_ENV'] else 'megaphonely.config.Production'
    app.config.from_object(config)

    db.init_app(app)
    migrate.init_app(app, db)

    from .models import User, Role
    users = SQLAlchemyUserDatastore(db, User, Role)
    security.init_app(app, users)

    admin.init_app(app)
    admin.add_view(ModelView(User, db.session))

    from .views.home import home
    from .views.account import account
    app.register_blueprint(home)
    app.register_blueprint(account)

    @app.before_first_request
    def create_user():
        db.create_all()
        users.create_user(email='matt@nobien.net', password='password')
        db.session.commit()

    return app
