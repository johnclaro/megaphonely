from django import forms
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.forms import UserCreationForm

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, ButtonHolder

from .models import Profile


User = get_user_model()


class LoginForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Username'}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder':'Password'}))


class SignupForm(UserCreationForm):
    username = forms.CharField(label='username', widget=forms.TextInput(attrs={'placeholder': 'Username'}))
    email = forms.EmailField(label='email', widget=forms.EmailInput(attrs={'placeholder': 'Email'}))
    password1 = forms.CharField(label='password1', widget=forms.PasswordInput(attrs={'placeholder': 'Password'}))
    password2 = forms.CharField(label='password2', widget=forms.PasswordInput(attrs={'placeholder': 'Confirm password'}))

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')


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
