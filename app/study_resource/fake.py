from . import models
from django.db.utils import IntegrityError
from faker import Faker
from random import randint, choice, choices
from datetime import date
from django.conf import settings
from django.template.defaultfilters import slugify
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
    name = f.text().split('.')[0]
    sr = models.StudyResource(
        name=name,
        slug=slugify(name),
        publication_date=f.date_between(date(2000, 1, 1), date.today()),
        published_by=f.name(),
        url=f'{f.url()}{randint(1000, 9999999)}/{randint(1000, 9999999)}',
        summary=f.text(),
        price=choice(models.StudyResource.Price.choices)[0],
        media=choice(models.StudyResource.Media.choices)[0],
        experience_level=choice(models.StudyResource.ExperienceLevel.choices)[0],
        author=user,
    )
    return sr


def new_study_resource_review(study_resource, author):
    review = models.Review(
        study_resource=study_resource,
        author=author,
        rating=randint(1, settings.MAX_RATING),
        text=f.text(),
    )
    return review


def study_resources_bulk(count, users):
    items = [new_study_resource(choice(users)) for _ in range(count)]
    models.StudyResource.objects.bulk_create(items)
    tags = models.Tag.objects.all()
    techs = models.Technology.objects.all()
    items = models.StudyResource.objects.all()
    for i in items:
        i.tags.add(*choices(tags, k=randint(1, 4)))
        i.technologies.add(*choices(techs, k=randint(1, 3)))


def reviews_bulk(resources, users, count):
    reviews = []
    only_one_review_per_user_check = []
    for _ in range(count):
        review = new_study_resource_review(
            study_resource=choice(resources),
            author=choice(users))
        identificator = f'{review.study_resource.id}{review.author.id}'
        if identificator in only_one_review_per_user_check:
            continue
        only_one_review_per_user_check.append(identificator)
        reviews.append(review)
    models.Review.objects.bulk_create(reviews)

#
# def new_collection(user):
#     collection = models.Collection(
#         owner=user,
#         name=f.text(40),
#         description=f.text(),
#     )
#     collection.save()
#     collection.resources.add(*choices(models.StudyResource.objects.all(), k=randint(1, 4)))
#     collection.tags.add(*choices(models.Tag.objects.all(), k=randint(1, 4)))
#     collection.technologies.add(*choices(models.Technology.objects.all(), k=randint(1, 3)))
