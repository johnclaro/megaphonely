from flask import current_app, Blueprint, render_template, jsonify, url_for
from flask_login import current_user

home = Blueprint('home', __name__, url_prefix='/')

@home.route('')
def index():
    template = render_template('home/index.html')
    if current_user.is_authenticated:
        template = render_template('dashboard/index.html')
    return template

@home.route('pricing')
def pricing():
    return render_template('home/pricing.html')

@home.route('terms')
def terms():
    return render_template('home/terms.html')

@home.route('privacy')
def privacy():
    return render_template('home/privacy.html')

@home.route('sitemap')
def sitemap():
    def has_no_empty_params(rule):
        defaults = rule.defaults if rule.defaults is not None else ()
        arguments = rule.arguments if rule.arguments is not None else ()
        return len(defaults) >= len(arguments)

    links = []
    for rule in current_app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser
        # and rules that require parameters
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            links.append((url, rule.endpoint))
    # links is now a list of url, endpoint tuples

    return jsonify({'links': links})