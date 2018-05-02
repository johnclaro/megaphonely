from django import forms

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, HTML, ButtonHolder, Submit
from crispy_forms.bootstrap import InlineRadios

from .models import Content, Social, Company


class ContentForm(forms.ModelForm):
    class Meta:
        model = Content
        fields = ['message', 'multimedia', 'schedule', 'schedule_at', 'socials']
        widgets = {
            'socials': forms.SelectMultiple(
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
        labels = {'multimedia': 'Image'}

    def __init__(self, *args, **kwargs):
        account = kwargs.pop('account')
        super(ContentForm, self).__init__(*args, **kwargs)
        socials = Social.objects.filter(account=account)
        self.fields['socials'].queryset = socials
        self.helper = FormHelper()
        self.helper.layout = Layout(
            'message',
            'multimedia',
            'socials',
            InlineRadios('schedule'),
            'schedule_at',
            HTML(
                """
                <button type='submit' class='btn btn-primary btn-block'>
                    <i id="twitter_content" class="fab fa-twitter-square" style="color: white; display: none;"></i>
                    <i id="facebook_content" class="fab fa-facebook" style="color: white; display: none;"></i>
                    <i id="linkedin_content" class="fab fa-linkedin" style="color: white; display: none;"></i>
                   Share
                </button>
                """
            )
        )
        self.helper.form_method = 'post'


class CompanyForm(forms.ModelForm):
    class Meta:
        model = Company
        fields = ['name', 'picture']

    def __init__(self, *args, **kwargs):
        account = kwargs.pop('account')
        super(CompanyForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.layout = Layout(
            'name',
            'picture',
            ButtonHolder(
                Submit('submit', 'Submit',
                       css_class='btn btn-primary btn-block')
            )
        )
        self.helper.form_method = 'post'
