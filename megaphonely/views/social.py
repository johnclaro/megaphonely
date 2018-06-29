from flask import current_app, Blueprint, render_template
from flask_security import current_user
from social_core.actions import do_auth

social = Blueprint('social', __name__, url_prefix='/socials/')

@social.route('facebook')
def facebook():
    app_id = current_app.config['FACEBOOK_APP_ID']
    return render_template('socials/connect.html', app_id=app_id)
