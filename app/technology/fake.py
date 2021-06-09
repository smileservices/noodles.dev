from random import choice, randint, choices
import os
import shutil
from faker import Faker
from django.conf import settings
from .models import Technology
from users.fake import create_user_single, create_bulk_users
from users.models import CustomUser
from category.models import Category
from core.fixtures.technologies import make_technologies_and_categories

f = Faker()
MEDIA_IMAGES_PATH = os.path.join(settings.MEDIA_ROOT, 'technologies')


def clean_technologies():
    Technology.objects.all().delete()
    shutil.rmtree(MEDIA_IMAGES_PATH)
    os.mkdir(MEDIA_IMAGES_PATH)


def create_technologies():
    created_tech = {}
    user = create_user_single()
    cats_backend = Category.objects.get(name='Backend')
    cats_frontend = Category.objects.get(name='Frontend')
    cats_lang = Category.objects.get(name='Programming Languages')
    for t in ['reactJs', 'python', 'django', 'php', 'ruby', 'laravel', 'linux', 'docker', 'nginx']:
        tobj = Technology(
            name=t,
            author=user,
            description=f.text(),
            license=choice(Technology.LicenseType.choices)[0],
            url=f.url(),
            owner=f.company(),
            meta='',
            image_file='',
            featured=True
        )
        tobj.save()
        created_tech[t] = tobj

    created_tech['django'].ecosystem.add(created_tech['python'])
    created_tech['django'].ecosystem.add(created_tech['python'])
    created_tech['laravel'].ecosystem.add(created_tech['php'])
    created_tech['nginx'].ecosystem.add(created_tech['linux'])
    created_tech['django'].save()
    created_tech['laravel'].save()
    created_tech['nginx'].save()
    categories = Category.objects.all()

    for t in ['nextjs', 'sphinx', 'mino', 'bibigi', 'futarelo', 'vuejs']:
        tobj = Technology(
            name=t,
            author=user,
            description=f.text(),
            license=choice(Technology.LicenseType.choices)[0],
            url=f.url(),
            owner=f.company(),
            meta='',
            image_file='',
        )
        tobj.save()
        for _ in range(choice([0,1,2])):
            tobj.category.add(choice(categories))
        created_tech[t] = tobj

    return created_tech


def create_technology_edit_suggestions():
    technologies = Technology.objects.all()
    users = [create_user_single() for _ in range(5)]
    for tech in technologies:
        edsug = tech.edit_suggestions.new({
            'name': f"{tech.name} edited",
            'description': tech.description,
            'license': tech.license,
            'url': tech.url,
            'owner': tech.owner,
            'meta': tech.meta,
            'edit_suggestion_author': choice(users),
            'image_file': tech.image_file,
        })
        edsug.ecosystem.add(technologies[0])
        for c in tech.category.all():
            edsug.category.add(c)

def bulk_votes(n=30):
    create_bulk_users(n)
    users = CustomUser.objects.all()
    techs = Technology.objects.all()
    for tech in techs:
        for _ in range(randint(0, n)):
            try:
                tech.vote_up(choice(users)) if randint(0, 1) else tech.vote_down(choice(users))
            except:
                pass


def create_technologies_from_fixtures():
    make_technologies_and_categories()
