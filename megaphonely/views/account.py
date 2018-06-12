from flask import current_app, Blueprint, render_template

account = Blueprint('account', __name__, url_prefix='/account/')

@account.route('/settings')
def settings():
    return render_template('account/settings.html')
