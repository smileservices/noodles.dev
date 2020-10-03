from .models import Problem, Solution
from tag.models import Tag
from technology.models import Technology
from faker import Faker
from django.template.defaultfilters import slugify

import random

f = Faker()
tags = Tag.objects.all()
techs = Technology.objects.all()


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
    )
    s.save()
    s.tags.set(random.choices(tags, k=random.randint(1, 5)))
    s.technologies.set(random.choices(techs, k=random.randint(1, 2)))
    return s
