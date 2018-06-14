from flask_security.forms import ConfirmRegisterForm, LoginForm, Required
from wtforms import StringField

class ExtendedLoginForm(LoginForm):
    email = StringField('Email or username', [Required()])

class ExtendedConfirmRegisterForm(ConfirmRegisterForm):
    username = StringField('Username', [Required()])