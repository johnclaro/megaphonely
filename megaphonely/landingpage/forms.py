from django import forms

from .choices import KINDS, CATEGORIES


class CharlieForm(forms.Form):
    email = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Email address'}))
    kind = forms.ChoiceField(widget=forms.Select(attrs={'class': 'form-control'}), choices=KINDS)
    categories = forms.ChoiceField(widget=forms.Select(attrs={'class': 'form-control'}), choices=CATEGORIES)