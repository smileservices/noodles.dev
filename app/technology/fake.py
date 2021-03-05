from random import choice, randint, choices
import os
import shutil
from faker import Faker
from .models import Technology
from users.fake import create_user_single, create_bulk_users
from users.models import CustomUser
from category.models import Category
from core.fixtures.technologies import make_technologies_and_categories

f = Faker()
MEDIA_IMAGES_PATH = os.path.join(os.getcwd(), '..', 'MEDIA', 'technologies')


def clean_technologies():
    Technology.objects.all().delete()
    shutil.rmtree(MEDIA_IMAGES_PATH)
    os.mkdir(MEDIA_IMAGES_PATH)


def create_technologies():
    created_tech = {}
    user = create_user_single()
    categories = Category.objects.all()
    for t in ['reactJs', 'python', 'django', 'php', 'ruby', 'laravel', 'linux', 'docker', 'nginx']:
        tobj = Technology(
            name=t,
            author=user,
            description=f.text(),
            license=choice(Technology.LicenseType.choices)[0],
            url=f.url(),
            owner=f.company(),
            pros=f.text(),
            cons=f.text(),
            limitations=f.text(),
            category=choice(categories),
            image_file='',
            featured=True
        )
        tobj.save()
        created_tech[t] = tobj

    created_tech['django'].ecosystem.add(created_tech['python'])
    created_tech['laravel'].ecosystem.add(created_tech['php'])
    created_tech['nginx'].ecosystem.add(created_tech['linux'])
    created_tech['django'].save()
    created_tech['laravel'].save()
    created_tech['nginx'].save()

    for t in ['nextjs', 'sphinx', 'mino', 'bibigi', 'futarelo', 'vuejs']:
        tobj = Technology(
            name=t,
            author=user,
            description=f.text(),
            license=choice(Technology.LicenseType.choices)[0],
            url=f.url(),
            owner=f.company(),
            pros=f.text(),
            cons=f.text(),
            limitations=f.text(),
            category=choice(categories),
            image_file='',
        )
        tobj.save()
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
            'pros': tech.pros,
            'cons': tech.cons,
            'category': tech.category,
            'limitations': tech.limitations,
            'edit_suggestion_author': choice(users)
        })
        edsug.ecosystem.add(technologies[0])


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
