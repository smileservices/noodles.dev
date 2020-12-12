from random import choice, randint, choices

from faker import Faker
from .models import Technology
from users.models import CustomUser

f = Faker()


def clean_technologies():
    Technology.objects.all().delete()


def create_technologies():
    created_tech = {}
    users = CustomUser.objects.all()
    for t in ['reactJs', 'python', 'django', 'php', 'ruby', 'laravel', 'linux', 'docker', 'nginx']:
        tobj = Technology(
            name=t,
            author=choice(users),
            description=f.text(),
            license=choice(Technology.LicenseType.choices)[0],
            url=f.url(),
            owner=f.company(),
            pros=f.text(),
            cons=f.text(),
            limitations=f.text(),
        )
        tobj.save()
        created_tech[t] = tobj

    created_tech['django'].ecosystem.add(created_tech['python'])
    created_tech['laravel'].ecosystem.add(created_tech['php'])
    created_tech['nginx'].ecosystem.add(created_tech['linux'])


def create_technology_edit_suggestions():
    technologies = Technology.objects.all()
    users = CustomUser.objects.all()
    for tech in technologies:
        edsug = tech.edit_suggestions.new({
            'name': f"{tech.name} edited",
            'description': tech.description,
            'license': tech.license,
            'url': tech.url,
            'owner': tech.owner,
            'pros': tech.pros,
            'cons': tech.cons,
            'limitations': tech.limitations,
            'edit_suggestion_author': choice(users)
        })
        edsug.ecosystem.add(technologies[0])
