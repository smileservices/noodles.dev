from random import randint, choice, choices
from study_resource.models import StudyResource
from technology.models import Technology
from tag.models import Tag
from faker import Faker

from . import models
from users.models import CustomUser

f = Faker()


def clean():
    models.Collection.objects.all().delete()


def new_collection(user=None):
    user = user if user else choice(CustomUser.objects.all())
    tags = Tag.objects.all()
    techs = Technology.objects.all()
    collection = models.Collection(
        author=user,
        name=f.text(40),
        description=f.text(),
        is_public=choice([True, False])
    )
    collection.save()
    collection.resources.add(*choices(StudyResource.objects.all(), k=randint(1, 4)))
    collection.tags.add(*choices(tags, k=randint(1, 4)))
    collection.technologies.add(*choices(techs, k=randint(1, 3)))


def collections_bulk(count=10):
    users = CustomUser.objects.all()
    for _ in range(count):
        new_collection(choice(users))
