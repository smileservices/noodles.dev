from .models import Problem, Solution
from tag.models import Tag
from category.models import Category
from technology.models import Technology
from faker import Faker
from django.template.defaultfilters import slugify
from users.models import CustomUser
import random

f = Faker()
tags = Tag.objects.all()
categories = Category.objects.all()
techs = Technology.objects.all()
users = CustomUser.objects.all()


def clean():
    Problem.objects.all().delete()
    Solution.objects.all().delete()


def create_problem(parent=None, author=None):
    name = f.text().split('.')[0]
    p = Problem(
        name=name,
        slug=slugify(name),
        description=f.text(),
        category=random.choice(categories),
        parent=parent,
        author=author if author else random.choice(users)
    )
    p.save()
    p.tags.set(random.choices(tags, k=random.randint(1, 5)))
    return p


def create_solution(problem, author=None):
    name = f.text().split('.')[0]
    s = Solution(
        name=name,
        slug=slugify(name),
        description=f.text(),
        parent=problem,
        author=author if author else random.choice(users)
    )
    s.save()
    s.tags.set(random.choices(tags, k=random.randint(1, 5)))
    s.technologies.set(random.choices(techs, k=random.randint(1, 2)))
    return s


def create_problem_edit_suggestions(problem, parent_solution=None, author=None):
    # create dummy edit suggestion data
    dummy_data = {
        'name': problem.name + ' edited',
        'parent': parent_solution if parent_solution else random.choice(Solution.objects.all()),
        'slug': problem.slug,
        'description': problem.description,
        'category': problem.category,
        'edit_suggestion_author': author if author else random.choice(users),
        'edit_suggestion_reason': 'edit test',
    }
    edsug = problem.edit_suggestions.new(dummy_data)
    edsug.tags.set(problem.tags.all())


def create_solution_edit_suggestions(solution, parent_problem=None, author=None):
    # create dummy edit suggestion data
    dummy_data = {
        'name': solution.name + ' edited',
        'parent': parent_problem if parent_problem else random.choice(Problem.objects.all()),
        'slug': solution.slug,
        'description': solution.description,
        'edit_suggestion_author': author if author else random.choice(users),
        'edit_suggestion_reason': 'edit test',
    }
    edsug = solution.edit_suggestions.new(dummy_data)
    edsug.tags.set(solution.tags.all())