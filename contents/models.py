from django.db.models import (Model, TextField)


class Content(Model):
    message = TextField()
