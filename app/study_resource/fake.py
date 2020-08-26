from . import models
from faker import Faker
from random import randint, choice, choices
from datetime import date
from django.conf import settings

f = Faker()


def clean():
    models.Tag.objects.all().delete()
    models.Technology.objects.all().delete()
    models.StudyResource.objects.all().delete()
    models.Collection.objects.all().delete()


def initial_data():
    for t in ['frontend', 'reactJs', 'python', 'django', 'vscode', 'stuff']:
        tobj = models.Tag(name=t)
        tobj.save()

    for t in ['reactJs', 'python', 'django', 'php', 'ruby', 'laravel', 'linux', 'docker', 'nginx']:
        tobj = models.Technology(
            name=t,
            description=f.text(),
            version=f'{randint(0, 6)}.{randint(0, 30)}',
            url=f.url()
        )
        tobj.save()


def new_study_resource(user):
    sr = models.StudyResource(
        name=f.text().split('.')[0],
        publication_date=f.date_between(date(2000, 1, 1), date.today()),
        published_by=f.name(),
        url=f.url(),
        summary=f.text(),
        price=choice(models.StudyResource.Price.choices)[0],
        media=choice(models.StudyResource.Media.choices)[0],
        experience_level=choice(models.StudyResource.ExperienceLevel.choices)[0],
        author=user,
    )
    sr.save()
    sr.tags.add(*choices(models.Tag.objects.all(), k=randint(1, 4)))
    sr.technologies.add(*choices(models.Technology.objects.all(), k=randint(1, 3)))
    return sr


def new_study_resource_review(study_resource, user):
    review = models.Review(
        study_resource=study_resource,
        author=user,
        rating=randint(1, settings.MAX_RATING),
        text=f.text(),
    )
    return review


def new_collection(user):
    collection = models.Collection(
        owner=user,
        name=f.text(40),
        description=f.text(),
    )
    collection.save()
    collection.resources.add(*choices(models.StudyResource.objects.all(), k=randint(1, 4)))
    collection.tags.add(*choices(models.Tag.objects.all(), k=randint(1, 4)))
    collection.technologies.add(*choices(models.Technology.objects.all(), k=randint(1, 3)))
