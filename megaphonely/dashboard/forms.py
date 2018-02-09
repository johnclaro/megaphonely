from django import forms

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, Fieldset, ButtonHolder
from crispy_forms.bootstrap import AccordionGroup, Accordion

from .models import Content





class ContentForm(forms.ModelForm):

    class Meta:
        model = Content
        fields = '__all__'
        exclude = ['account']
        labels = {
            'is_schedule_now': 'Schedule now',
            'is_auto_schedule': 'Auto schedule'
        }

    def __init__(self, *args, **kwargs):
        super(ContentForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            Fieldset(
                'Han Sung',
                'message',
                'multimedia',
            ),
            ButtonHolder(
                Submit('submit', 'Submit', css_class='button white')
            )
        )
        self.helper.form_method = 'post'
