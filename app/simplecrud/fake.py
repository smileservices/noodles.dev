from random import choice
from faker import Faker
from .models import People


def create_people(no=10, locales=False):
    fake = Faker(locales)
    for i in range(no):
        person = People(
            name=fake.name(),
            age=choice(range(6, 80)),
            nationality=choice(People.Nationality.choices)[0]
        )
        person.save()
