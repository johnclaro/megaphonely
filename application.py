from flask import Flask

def create_app():
    application = Flask(__name__)

    from views.admin import admin
    from views.home import home
    application.register_blueprint(admin)
    application.register_blueprint(home)

    return application

def main():
    application = create_app()
    application.run()

if __name__ == '__main__':
    main()
