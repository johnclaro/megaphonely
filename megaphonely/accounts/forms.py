from django import forms

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, ButtonHolder, HTML

from .models import Profile


class CustomSignupForm(forms.Form):

    def __init__(self, *args, **kwargs):
        super(CustomSignupForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_show_errors = False  # Errors are rendered in a div
        self.helper.layout = Layout(
            'username',
            'email',
            'password1',
        )

    def signup(self, request, user):
        user.save()

class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['fullname', 'picture', 'newsletter']
        labels = {
            'fullname': 'Name',
            'newsletter': 'Email me about latest news/updates about Megaphonely'
        }

    def __init__(self, *args, **kwargs):
        account = kwargs.pop('account')
        super(ProfileForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            'fullname',
            'picture',
            'newsletter',
            ButtonHolder(
                Submit('submit', 'Submit',
                       css_class='btn btn-primary btn-block')
            )
        )
        self.helper.form_method = 'post'
