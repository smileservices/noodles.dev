from django.core.management.base import BaseCommand

from users.models import CustomUser
from problem_solution import fake


class Command(BaseCommand):
    help = "Populate database with test objects"

    def add_arguments(self, parser):

        parser.add_argument(
            "--clear",
            action="store_true",
            default=False,
            help="if true, will delete all, excepting staff users",
        )

    def handle(self, *args, **options):
        if options['clear']:
            fake.clean()
        problems = []
        solutions = []
        for _ in range(10):
            problems.append(fake.create_problem())
        for p in problems:
            solutions.append(fake.create_solution(p))
        for s in solutions:
            problems.append(fake.create_problem(s))
        for p in problems:
            fake.create_problem_edit_suggestions(p)
