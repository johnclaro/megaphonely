from django import forms

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Submit, Layout, ButtonHolder, HTML

from .models import Profile


class CustomSignupForm(forms.Form):

    def __init__(self, *args, **kwargs):
        super(CustomSignupForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            HTML(
                """
                <h4 class="card-title">Signup</h4>
                <div class="form-group">
                    <small>Comes with a <b>7-day free trial</b></small>
                </div>
                """
            ),
            'username',
            'email',
            'password1',
            HTML(
                """
                <div class="form-check form-group">
                    <input type="checkbox" class="form-check-input" id="tos" required>
                    <label class="form-check-label" for="tos" style="font-size: 14px;">
                        I agree to the <a href="{% url 'terms' %}">Megaphonely Terms.</a>
                    </label>
                </div>
                """
            ),
            ButtonHolder(
                Submit('submit', 'Signup',
                       css_class='btn btn-primary btn-block')
            ),
        )

    def signup(self, request, user):
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
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
