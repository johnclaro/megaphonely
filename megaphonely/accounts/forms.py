from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import AuthenticationForm

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, ButtonHolder

from .models import Profile


MyUser = get_user_model()


class LoginForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'class':'validate','placeholder': 'Username'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder':'Password'}))


class SignupForm(forms.ModelForm):
    username = forms.CharField(label='username', widget=forms.TextInput(attrs={'placeholder': 'Username'}))
    email = forms.EmailField(label='email', widget=forms.EmailInput(attrs={'placeholder': 'Email'}))
    password = forms.CharField(label='password', widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))

    class Meta:
        model = MyUser
        fields = ('username', 'email', 'password')


class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['picture']

    def __init__(self, *args, **kwargs):
        account = kwargs.pop('account')
        super(ProfileForm, self).__init__(*args, **kwargs)
        profile = Profile.objects.get(account=account)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            'picture',
            ButtonHolder(
                Submit('submit', 'Submit',
                       css_class='btn btn-primary btn-block')
            )
        )
        self.helper.form_method = 'post'
