from flask import Flask

def create_app():
    app = Flask(__name__)

    from views.admin import admin
    from views.home import home
    app.register_blueprint(admin)
    app.register_blueprint(home)

    return app

def main():
    application = create_app()
    application.run()

if __name__ == '__main__':
    main()
