from django.db.models import (Model, TextField)


class ContentModel(Model):
    message = TextField()
