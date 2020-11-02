from .models import Problem, Solution
from tag.models import Tag
from technology.models import Technology
from faker import Faker
from django.template.defaultfilters import slugify
from users.models import CustomUser
import random

f = Faker()
tags = Tag.objects.all()
techs = Technology.objects.all()
users = CustomUser.objects.all()


def clean():
    Problem.objects.all().delete()
    Solution.objects.all().delete()


def create_problem(parent=None):
    name = f.text().split('.')[0]
    p = Problem(
        name=name,
        slug=slugify(name),
        description=f.text(),
        parent=parent,
        author=random.choice(users)
    )
    p.save()
    p.tags.set(random.choices(tags, k=random.randint(1, 5)))
    return p


def create_solution(problem):
    name = f.text().split('.')[0]
    s = Solution(
        name=name,
        slug=slugify(name),
        description=f.text(),
        parent=problem,
        author=random.choice(users)
    )
    s.save()
    s.tags.set(random.choices(tags, k=random.randint(1, 5)))
    s.technologies.set(random.choices(techs, k=random.randint(1, 2)))
    return s

def create_problem_edit_suggestions(problem):
    # create dummy edit suggestion data
    dummy_data = {
        'edit_suggestion_parent': problem,
        'author': random.choice(users),
        'name': problem.name + ' edited',
        'slug': problem.slug,
        'edit_suggestion_reason': 'edit test',
        'description': problem.description,
    }
    edsug = problem.edit_suggestions.create(**dummy_data)
    edsug.tags.set(problem.tags.all())
    edsug.save()
    dummy_data.update({'name': 'second edit sug', 'author': random.choice(users)})
    edsug2 = problem.edit_suggestions.create(**dummy_data)
    edsug2.tags.set(random.choices(tags, k=3))
    edsug2.save()
    changes = edsug.diff_against_parent()
    edsug.publish(random.choice(users))
    pass