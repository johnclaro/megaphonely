import os
from distutils.util import strtobool

from dotenv import load_dotenv, find_dotenv

from megaphone.app import create_app

load_dotenv(find_dotenv())
application = create_app()


if __name__ == '__main__':
    application.run(
        debug=bool(strtobool(os.environ['DEBUG'])),
        port=int(os.environ['PORT']),
        host=os.environ['HOST']
    )
