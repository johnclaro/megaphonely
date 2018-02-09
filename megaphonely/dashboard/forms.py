from django import forms

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, Fieldset, ButtonHolder

from .models import Content


class ContentForm(forms.ModelForm):
    class Meta:
        model = Content
        fields = '__all__'
        exclude = ['account']
        labels = {
            'is_schedule_now': 'Schedule now',
        }
        widgets = {
            'schedule_at': forms.TextInput(
                attrs={
                    'class': 'datetimepicker-input',
                    'data-target': '#id_schedule_at',
                    'data-toggle': 'datetimepicker',
                    'data-date-format': 'YYYY-MM-DD HH:mm'
                }
            )
        }

    def __init__(self, *args, **kwargs):
        super(ContentForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            'message',
            'multimedia',
            'is_schedule_now',
            'schedule_at',
            ButtonHolder(
                Submit('submit', 'Submit', css_class='btn btn-primary btn-block')
            )
        )
        self.helper.form_method = 'post'
