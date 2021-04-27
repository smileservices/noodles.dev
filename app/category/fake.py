from .models import Category
from faker import Faker

f = Faker()


def clean_categories():
    Category.objects.all().delete()


def create_categories():
    web_dev = Category.objects.create(name='Web Dev', description=f.text(), parent=None)
    lang = Category.objects.create(name='Programming Languages', description=f.text(), parent=None)
    dbs = Category.objects.create(name='Databases', description=f.text(), parent=None)
    Category.objects.create(name='Frontend', description=f.text(), parent=web_dev)
    Category.objects.create(name='Backend', description=f.text(), parent=web_dev)
    Category.objects.create(name='Relational', description=f.text(), parent=dbs)
    Category.objects.create(name='Non-Relational', description=f.text(), parent=dbs)
    Category.objects.create(name='Data Structures', description=f.text(), parent=lang)
    Category.objects.create(name='Dev Ops', description=f.text(), parent=web_dev)
