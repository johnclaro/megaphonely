from flask import current_app, Blueprint, render_template, jsonify, url_for
from flask_security import current_user
from social_core.actions import do_auth

social = Blueprint('social', __name__, url_prefix='/socials/')


@social.route('facebook')
def facebook():
	strategy = ''
    response = do_auth('facebook')
    print("response:", response)
    template = render_template('home/index.html')
    if current_user.is_authenticated:
        template = render_template('dashboard/index.html')

    return template
