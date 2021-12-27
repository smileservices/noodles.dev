from . import models
import os
import shutil
from faker import Faker
from random import randint, choice, choices
from datetime import date
from django.conf import settings
from django.template.defaultfilters import slugify
from django.db.utils import IntegrityError
from django.core.files import File
from users.models import CustomUser
from technology.models import Technology
from tag.models import Tag
from category.models import Category

f = Faker()
FAKE_IMAGES_PATH = os.path.join(os.getcwd(), 'study_resource', 'fake_images')
MEDIA_IMAGES_PATH = os.path.join(settings.MEDIA_ROOT, 'tutorials')


def clean():
    models.StudyResource.objects.all().delete()
    shutil.rmtree(MEDIA_IMAGES_PATH)
    os.mkdir(MEDIA_IMAGES_PATH)


def new_study_resource(user):
    name = f.text().split('.')[0]
    categories = Category.objects.all()
    # get images; move to MEDIA dir; open
    image_name = choice(os.listdir(FAKE_IMAGES_PATH))
    image_file_path = os.path.join(FAKE_IMAGES_PATH, image_name)
    shutil.copy(image_file_path, os.path.join(MEDIA_IMAGES_PATH, image_name))
    image_file = open(os.path.join(MEDIA_IMAGES_PATH, image_name), 'rb')
    sr = models.StudyResource(
        name=name,
        status=1,
        slug=slugify(name),
        publication_date=f.date_between(date(2000, 1, 1), date.today()),
        published_by=f.name(),
        url=f'{f.url()}{randint(1000, 9999999)}/{randint(1000, 9999999)}',
        summary=f.text(),
        price=choice(models.StudyResource.Price.choices)[0],
        media=choice(models.StudyResource.Media.choices)[0],
        experience_level=choice(models.StudyResource.ExperienceLevel.choices)[0],
        author=user,
        category=choice(categories),
    )
    sr.image_file.save(image_name, content=File(image_file))
    sr.save()
    return sr


def new_study_resource_review(study_resource, author):
    review = models.Review(
        study_resource=study_resource,
        author=author,
        rating=randint(1, settings.MAX_RATING),
        text=f.text(),
    )
    return review


def study_resource_edit_suggestions(resource: models.StudyResource, author=None):
    users = CustomUser.objects.all()
    data = {
        'name': f'{resource.name} edit',
        'publication_date': resource.publication_date,
        'published_by': resource.published_by,
        'url': resource.url,
        'image_file': resource.image_file,
        'summary': resource.summary,
        'price': resource.price,
        'media': resource.media,
        'category': resource.category,
        'experience_level': resource.experience_level,
        'edit_suggestion_author': author if author else choice(users),
        'edit_suggestion_reason': 'edit test',
    }
    edsug = resource.edit_suggestions.new(data)
    edsug.tags.set(resource.tags.all())
    for tech in resource.technologies.through.objects.filter(study_resource=resource.pk).all():
        try:
            edsug.technologies.through.objects.create(
                technology_id=tech.technology_id,
                name=tech.name,
                study_resource=edsug,
                version=tech.version
            )
        except IntegrityError:
            pass


def study_resources_bulk(count=20):
    users = CustomUser.objects.all()
    tags = Tag.objects.all()
    techs = Technology.objects.all()
    items = [new_study_resource(choice(users)) for _ in range(count)]
    # models.StudyResource.objects.bulk_create(items)
    # items = models.StudyResource.objects.all()
    for i in items:
        i.tags.add(*choices(tags, k=randint(1, 4)))
        for tech in choices(techs, k=randint(1, 3)):
            try:
                models.StudyResourceTechnology.objects.create(
                    technology=tech,
                    study_resource=i,
                    version=float(f'{randint(0, 5)}.{randint(0, 90)}')
                )
            except IntegrityError:
                pass
        i.save()


def study_resources_edits_bulk(count=10):
    resources = models.StudyResource.objects.all()
    for _ in range(count):
        study_resource_edit_suggestions(choice(resources))


def reviews_bulk(count=10):
    users = CustomUser.objects.all()
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
        review.save()
