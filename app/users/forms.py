from django.forms import Form, CharField


class SignupForm(Form):
    first_name = CharField(max_length=30, label='First Name')
    last_name = CharField(max_length=150, label='Last Name')

    def signup(self, request, user):
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.save()