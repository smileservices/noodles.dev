from faker import Faker
from core.random_data import email as fake_email
from .models import CustomUser


def clean_users():
    CustomUser.objects.all().delete()


def create_user(locale=False):
    fake = Faker()
    name_arr = fake.name().split(' ')
    fname, lname = name_arr[0], name_arr[1]
    email = fake_email(fname, lname)
    new_user = CustomUser(
        first_name=fname,
        last_name=lname,
        username=fake.user_name(),
        email=email
    )
    password = '123'
    new_user.set_password(password)
    return new_user


def create_user_single(staff=False):
    u = create_user()
    u.is_staff = staff
    u.save()
    return u


def create_bulk_users(count):
    users = [create_user() for _ in range(count)]
    CustomUser.objects.bulk_create(users)
