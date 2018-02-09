from django import forms

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, Fieldset, ButtonHolder

from .models import Content


class ContentForm(forms.ModelForm):
    class Meta:
        model = Content
        fields = '__all__'
        exclude = ['account']

    def __init__(self, *args, **kwargs):
        super(ContentForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            'message',
            'multimedia',
            ButtonHolder(
                Submit('submit', 'Submit', css_class='button white')
            )
        )
        self.helper.form_method = 'post'
