from django import forms

class TokenForm(forms.Form):
    token = forms.CharField(max_length=10)