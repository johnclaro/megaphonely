import os, datetime
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_security import Security, SQLAlchemyUserDatastore
from flask_migrate import Migrate
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from flask_mail import Mail

db = SQLAlchemy()
security = Security()
migrate = Migrate()
admin = Admin(name='Megaphonely', template_mode='bootstrap3')
mail = Mail()

def create_app():
    app = Flask(__name__)
    config = 'megaphonely.config.Development' if os.environ['FLASK_ENV'] else 'megaphonely.config.Production'
    app.config.from_object(config)
    
    db.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)

    from .forms import ExtendedLoginForm, ExtendedConfirmRegisterForm
    from .models import User, Role
    users = SQLAlchemyUserDatastore(db, User, Role)
    security.init_app(app, users, login_form=ExtendedLoginForm, confirm_register_form=ExtendedConfirmRegisterForm)

    admin.init_app(app)
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(Role, db.session))

    from .views.home import home
    from .views.account import account
    app.register_blueprint(home)
    app.register_blueprint(account)

    @app.before_first_request
    def create_user():
        db.create_all()
        users.create_user(email='admin@megaphonely.com', username='admin', confirmed_at=datetime.datetime.now(),
                            password='$2b$12$k3mGO9YJxiPy6X5cfVSLLeC/NA726hX3gAcRlP961xyaHzdqYUa.m')
        db.session.commit()

    return app
