from . import models

from faker import Faker
from random import randint, choice, choices
from datetime import date
from django.conf import settings
from django.template.defaultfilters import slugify

from users.models import CustomUser
from technology.models import Technology
from tag.models import Tag

tags = Tag.objects.all()
techs = Technology.objects.all()
users = CustomUser.objects.all()

f = Faker()


def clean():
    models.StudyResource.objects.all().delete()
    models.Collection.objects.all().delete()


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


def new_collection(user=None):
    collection = models.Collection(
        owner=user if user else choice(users),
        name=f.text(40),
        description=f.text(),
    )
    collection.save()
    collection.resources.add(*choices(models.StudyResource.objects.all(), k=randint(1, 4)))
    collection.tags.add(*choices(tags, k=randint(1, 4)))
    collection.technologies.add(*choices(techs, k=randint(1, 3)))


def study_resource_edit_suggestions(resource:models.StudyResource, author=None):
    data = {
        'name': f'{resource.name} edit',
        'publication_date': resource.publication_date,
        'published_by': resource.published_by,
        'url': resource.url,
        'summary': resource.summary,
        'price': resource.price,
        'media': resource.media,
        'experience_level': resource.experience_level,
        'edit_suggestion_author': author if author else choice(users),
        'edit_suggestion_reason': 'edit test',
    }
    edsug = resource.edit_suggestions.new(data)
    edsug.tags.set(resource.tags.all())
    edsug.technologies.set(resource.technologies.all())



def study_resources_bulk(count=20):
    items = [new_study_resource(choice(users)) for _ in range(count)]
    models.StudyResource.objects.bulk_create(items)
    items = models.StudyResource.objects.all()
    for i in items:
        i.tags.add(*choices(tags, k=randint(1, 4)))
        i.technologies.add(*choices(techs, k=randint(1, 3)))


def study_resources_edits_bulk(count=10):
    resources = models.StudyResource.objects.all()
    for _ in range(count):
        study_resource_edit_suggestions(choice(resources))


def reviews_bulk(count=10):
    reviews = []
    resources = models.StudyResource.objects.all()
    older_reviews = models.Review.objects.all()
    only_one_review_per_user_check = [f'{review.study_resource.id}{review.author.id}' for review in older_reviews]
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


def collections_bulk(count=10):
    for _ in range(count):
        new_collection(choice(users))
