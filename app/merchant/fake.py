from random import choice, randint
from faker import Faker
from .models import MerchantModel, MerchantNoteModel
from users.fake import create_user


def create_merchant(locale=False, dates={'start_date': '-30w', 'end_date': 'now'}):
    fake = Faker(locale)
    user = create_user(locale)
    merchant = MerchantModel(
        user=user,
        name=fake.company(),
        active=choice([True, True, False])
    )
    merchant.save()
    random_date = fake.date_time_between(**dates)
    if dates:
        merchant.date_created = random_date
        merchant.save()
        merchant.user.date_joined = random_date
        merchant.user.save()
    return merchant


def create_merchant_notes(locale=False, dates={'start_date': '-30w', 'end_date': 'today'}):
    fake = Faker(locale)
    for merchant in MerchantModel.objects.all():
        if choice([True, False]):
            for i in range(randint(0, 3)):
                note = MerchantNoteModel(
                    merchant=merchant,
                    is_public=True,
                    content=fake.sentence()
                )
                note.save()
                note.date = fake.date_between(**dates)
                note.save()
