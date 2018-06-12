from flask import current_app, Blueprint, render_template
account = Blueprint('account', __name__, url_prefix='/account/')

@account.route('/login')
def login():
    return render_template('account/login.html')

@account.route('/signup')
def signup():
    return render_template('account/signup.html')

@account.route('/logout')
def logout():
    return render_template('home/index.html')

@account.route('/settings')
def settings():
    return render_template('account/settings.html')
