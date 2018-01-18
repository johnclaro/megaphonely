from django.db.models import Model, TextField, ForeignKey, CASCADE


class Content(Model):
    message = TextField()
    publisher = ForeignKey(
        'auth.User', related_name='contents', on_delete=CASCADE
    )
