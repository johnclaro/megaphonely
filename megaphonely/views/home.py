from flask import current_app, Blueprint, render_template
home = Blueprint('home', __name__, url_prefix='/')

@home.route('/')
def index():
    return render_template('home/index.html')

@home.route('/pricing')
def pricing():
    return render_template('home/pricing.html')

@home.route('/terms')
def terms():
    return render_template('home/terms.html')

@home.route('privacy')
def privacy():
    return render_template('home/privacy.html')
