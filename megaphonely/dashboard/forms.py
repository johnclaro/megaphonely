from django import forms

from crispy_forms.layout import Submit
from crispy_forms.helper import FormHelper

from .models import Content


class ContentForm(forms.ModelForm):

    class Meta:
        model = Content
        fields = '__all__'
        exclude = ['account']

    def __init__(self, *args, **kwargs):
        self.helper = FormHelper()
        self.helper.form_method = 'post'
        self.helper.add_input(Submit('submit', 'Submit'))
        super(ContentForm, self).__init__(*args, **kwargs)
