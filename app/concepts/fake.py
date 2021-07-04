from .models import CategoryConcept, TechnologyConcept
from faker import Faker

f = Faker()


def clean_concepts():
    CategoryConcept.objects.all().delete()
    TechnologyConcept.objects.all().delete()


def create_category_concept(name, category, author, parent=None):
    return CategoryConcept.objects.create(
        name=name,
        author=author,
        category=category,
        parent=parent,
        description=f.text(250),
        description_long=f.text(250),
    )


def create_technology_concept(name, technology, author, parent=None):
    return TechnologyConcept.objects.create(
        name=name,
        author=author,
        technology=technology,
        parent=parent,
        description=f.text(250),
        description_long=f.text(250),
    )
