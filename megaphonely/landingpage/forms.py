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
        label='What kind of influencer are you?'
    )
    category = forms.ChoiceField(widget=forms.Select(
        attrs={'class': 'form-control'}),
        choices=CATEGORIES,
        label='Which category do you primary target?'
    )

    def clean(self):
        cleaned_data = self.cleaned_data
        email = cleaned_data['email']

        if email and Charlie.objects.email_exists(email):
            msg = f"{email} is already registered"
            raise forms.ValidationError(msg)

        return cleaned_data
