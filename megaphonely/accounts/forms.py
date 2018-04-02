from django import forms

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, ButtonHolder

from .models import Profile


class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['picture', 'newsletter']
        labels = {
            'newsletter': 'Email me about latest news/updates about Megaphonely'
        }

    def __init__(self, *args, **kwargs):
        account = kwargs.pop('account')
        super(ProfileForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            'picture',
            'newsletter',
            ButtonHolder(
                Submit('submit', 'Update',
                       css_class='btn btn-primary btn-block')
            )
        )
        self.helper.form_method = 'post'
