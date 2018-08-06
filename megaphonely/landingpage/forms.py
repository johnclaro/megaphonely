from django import forms

from .models import Charlie
from .choices import KINDS, CATEGORIES


class CharlieForm(forms.Form):
    email = forms.EmailField(widget=forms.EmailInput(
        attrs={
            'class': 'form-control',
            'placeholder': 'Email address'
        }),
        label='What is your email?'
    )
    kind = forms.ChoiceField(widget=forms.Select(
        attrs={'class': 'form-control'}),
        choices=KINDS,
        label='Are you a brand or an influencer?'
    )
    category = forms.ChoiceField(widget=forms.Select(
        attrs={'class': 'form-control'}),
        choices=CATEGORIES,
        label='What category do you belong to?'
    )

    def clean(self):
        cleaned_data = self.cleaned_data
        email = cleaned_data['email']

        if email and Charlie.objects.email_exists(email):
            raise forms.ValidationError(
                f"{email} is already registered"
            )

        return cleaned_data
