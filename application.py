from dotenv import load_dotenv, find_dotenv

from megaphone.app import create_app

load_dotenv(find_dotenv())
application = create_app()


if __name__ == '__main__':
    application.run()
