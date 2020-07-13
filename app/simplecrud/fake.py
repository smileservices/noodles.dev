from random import choice
from faker import Faker
from .models import People


def create_person(locales=False):
    fake = Faker(locales)
    person = People(
        name=fake.name(),
        age=choice(range(6, 80)),
        nationality=choice(People.Nationality.choices)[0]
    )
    person.save()
