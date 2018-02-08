from django import forms

from crispy_forms.layout import Submit
from crispy_forms.helper import FormHelper

from .models import Content


class ContentForm(forms.ModelForm):

    class Meta:
        model = Content
        fields = ['message', 'schedule_at', 'multimedia']
        exclude = ['account']
        widgets = {'schedule_at': forms.DateInput(
            attrs={'type': 'date', 'class': 'datepicker'}
        )}

    def __init__(self, *args, **kwargs):
        super(ContentForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_method = 'post'
        self.helper.add_input(Submit('schedule', 'Schedule'))
        self.helper.add_input(Submit('schedule_now', 'Schedule Now'))
