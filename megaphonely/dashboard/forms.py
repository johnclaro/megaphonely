from django import forms

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, ButtonHolder
from crispy_forms.bootstrap import InlineRadios

from .models import Content


class ContentForm(forms.ModelForm):
    class Meta:
        model = Content
        fields = ['message', 'multimedia', 'schedule', 'schedule_at',
                  'content_socials']
        widgets = {
            'content_socials': forms.SelectMultiple(
                attrs={
                    'class': 'socials-multiple',
                    'multiple': 'multiple',
                    'name': 'socials[]'
                }
            ),
            'schedule_at': forms.TextInput(
                attrs={
                    'class': 'datetimepicker-input',
                    'data-target': '#id_schedule_at',
                    'data-toggle': 'datetimepicker'
                }
            )
        }

    def __init__(self, *args, account=None, **kwargs):
        print('Account:', account)
        super(ContentForm, self).__init__(account, *args, **kwargs)
        print(args)
        print('--')
        print(kwargs)
        print('--')
        print(self)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            'message',
            'multimedia',
            'content_socials',
            InlineRadios('schedule'),
            'schedule_at',
            ButtonHolder(
                Submit('submit', 'Submit',
                       css_class='btn btn-primary btn-block')
            )
        )
        self.helper.form_method = 'post'
