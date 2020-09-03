from faker import Faker
from core.random_data import email as fake_email
from .models import CustomUser


def create_user(locale=False):
    fake = Faker()
    name_arr = fake.name().split(' ')
    fname, lname = name_arr[0], name_arr[1]
    email = fake_email(fname, lname)
    new_user = CustomUser(
        first_name=fname,
        last_name=lname,
        email=email
    )
    password = '123'
    new_user.set_password(password)
    return new_user


def create_bulk_users(count):
    users = [create_user() for _ in range(count)]
    CustomUser.objects.bulk_create(users)