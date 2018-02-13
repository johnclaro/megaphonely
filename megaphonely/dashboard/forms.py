from django import forms

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, ButtonHolder
from crispy_forms.bootstrap import InlineRadios

from .models import Content, Social


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

    def __init__(self, *args, **kwargs):
        account = kwargs.pop('account')
        super(ContentForm, self).__init__(*args, **kwargs)
        social_links = Social.objects.filter(social_links=account)
        self.fields['content_socials'].queryset = social_links
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
