Lambdas
=======

Documentation about how the lambdas work

psycopg2
~~~~~~~~
Installing psycopg2 directly from requirements.txt does not work and requires
downloading https://github.com/jkehler/awslambda-psycopg2 then extracting the
psycopg2-3.6 folder and renaming it to psycopg2 to make it work. It is then
included in the config.yml under the build section to be included in the bundle

Usage
~~~~~
Go into the lambda directory, e.g. cd ~/megaphonely/lambdas/publish_to_facebook
Ensure lambda-deploy is installed in your system

.. code-block:: bash

    lambda deploy --use-requirements
