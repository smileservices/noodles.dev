from django.core.management.base import BaseCommand
from django.db import connection, models

from technology import fake


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
        fake.create_edit_suggestions()
