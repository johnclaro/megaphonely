from django import forms

from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, ButtonHolder, Submit

from .models import Content, Social, Team


class ContentForm(forms.ModelForm):
    class Meta:
        model = Content
        fields = ['message', 'socials', 'schedule', 'schedule_at', 'multimedia']
        widgets = {
            'message': forms.Textarea(
                attrs={'class': 'form-control',
                       'placeholder': 'What do you want to tell your audience?',
                       'rows': 4, 'cols': 15}
            ),
            'multimedia': forms.FileInput(attrs={'class': 'col-sm-12'}),
            'socials': forms.CheckboxSelectMultiple(
                attrs={'class': 'form-check-input'}
            ),
            'schedule': forms.Select(attrs={'class': 'form-control'}),
            'schedule_at': forms.TextInput(
                attrs={
                    'class': 'datetimepicker-input form-control',
                    'data-target': '#id_schedule_at',
                    'data-toggle': 'datetimepicker'
                }
            )
        }

    def __init__(self, *args, **kwargs):
        account = kwargs.pop('account')
        super(ContentForm, self).__init__(*args, **kwargs)
        socials = Social.objects.filter(account=account)
        self.fields['socials'].queryset = socials


class TeamForm(forms.ModelForm):
    class Meta:
        model = Team
        fields = ['name', 'picture']

    def __init__(self, *args, **kwargs):
        account = kwargs.pop('account')
        super(TeamForm, self).__init__(*args, **kwargs)
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
