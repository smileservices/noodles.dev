from faker import Faker
from .models import Post
import random
from users.models import CustomUser
from core.abstract_models import ResourceMixin

f = Faker()


def clean_posts():
    Post.objects.all().delete()


def __create_post(resource: ResourceMixin, user: CustomUser, parent:Post=None):
    return resource.discussions.create(
        content_object=resource,
        author=user,
        parent=parent,
        text=f.text(240)
    )


def populate_discussion(resource: ResourceMixin):
    users = CustomUser.objects.all()
    if users.count() == 0:
        raise ValueError('There are no users!')
    main_threads = []
    secondary_threads = []
    for _ in range(random.randint(0, 6)):
        main_threads.append(__create_post(resource, user=random.choice(users)))
    for parent in main_threads:
        for _ in range(random.randint(0, 3)):
            secondary_threads.append(__create_post(resource, user=random.choice(users), parent=parent))
    for parent in secondary_threads:
        for _ in range(random.randint(0, 2)):
            __create_post(resource, user=random.choice(users), parent=parent)
