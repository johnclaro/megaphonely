from django import forms

from crispy_forms.helper import FormHelper

from .models import Content


class ContentForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        self.helper = FormHelper()
        self.helper.form_class = 'form-horizontal'
        super(ContentForm, self).__init__(*args, **kwargs)

    class Meta:
        model = Content
        fields = ['message', 'schedule_at']
