from flask import Flask

def create_app():
    app = Flask(__name__)

    from views.admin import admin
    app.register_blueprint(admin)

    return app

def main():
    app = create_app()
    app.run()

if __name__ == '__main__':
    main()
