from social_flask_sqlalchemy.models import init_social
from megaphonely.app import create_app, db

app = create_app()

@app.cli.command()
def initialise():
    init_social(app, db.session)