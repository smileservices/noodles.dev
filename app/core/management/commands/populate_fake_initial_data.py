from django.core.management.base import BaseCommand

from django.db import connection, models
from django.template.defaultfilters import slugify
from random import randint, choice, choices

from tag.fake import clean_tags, create_tags
from technology.fake import clean_technologies, create_technologies, create_technology_edit_suggestions
from users.models import CustomUser
from users import fake as fake_users

from faker import Faker

f = Faker()


class Command(BaseCommand):
    help = "Populate database with test objects"

    def add_arguments(self, parser):
        parser.add_argument(
            "--createsuperuser",
            action="store_true",
            default=False,
            help="Create admin account",
        )
        parser.add_argument(
            "--clear",
            action="store_true",
            default=False,
            help="if true, will delete all, excepting staff users",
        )

        parser.add_argument(
            "--users",
            type=int,
            default=50,
            help="How many users",
        )

    def make_database_faster(self):
        """Sacrifice some of the safeguards of sqlite3 for speed.

        Users are not likely to run this command in a production environment.
        They are even less likely to run it in production while using sqlite3.
        """
        if "sqlite3" in connection.settings_dict["ENGINE"]:
            cursor = connection.cursor()
            cursor.execute("PRAGMA temp_store = MEMORY;")
            cursor.execute("PRAGMA synchronous = OFF;")

    def create_superuser(self, credentials):
        user, created = CustomUser.objects.get_or_create(
            email=credentials["email"],
            defaults={"is_active": True, "is_staff": True, "is_superuser": True},
        )
        if created:
            user.set_password(credentials["password"])
            user.save()
            msg = "Superuser - %(email)s/%(password)s" % credentials
        else:
            msg = "Superuser already exists - %(email)s" % credentials
        return msg

    def handle(self, *args, **options):
        self.make_database_faster()

        if options['clear']:
            self.stdout.write('Cleaning all resources ... ')
            clean_tags()
            clean_technologies()
            CustomUser.objects.all().delete()
            self.stdout.write("Removed all users except staff users")
            credentials = {"email": "vlad@admin.com", "password": "123"}
            msg = self.create_superuser(credentials)
            self.stdout.write(msg)
            self.stdout.write('Tabula Rasa!')

        # create users
        fake_users.create_bulk_users(options['users'])
        self.stdout.write(" >> Created users: done")

        create_tags()
        self.stdout.write(" >> Created tags: done")
        create_technologies()
        self.stdout.write(" >> Created technologies: done")
        create_technology_edit_suggestions()
        self.stdout.write(" >> Created technologies edit suggestions: done")
