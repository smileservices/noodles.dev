from django.forms import Form, CharField, ModelForm
from allauth.account.forms import SignupForm as AllAuthSignUpForm
from .models import CustomUser
from captcha.fields import ReCaptchaField


class SignupForm(AllAuthSignUpForm):
    # first_name = CharField(max_length=30, label='First Name')
    # last_name = CharField(max_length=150, label='Last Name')
    captcha = ReCaptchaField()
    field_order = [
        # 'first_name',
        # 'last_name',
        'email',
        'password1',
        'password2',
        'captcha'
    ]

    def signup(self, request, user):
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.save()


class ProfileForm(ModelForm):

    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'about']
