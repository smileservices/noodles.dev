from io import StringIO

from django.apps import apps
from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import connection

from users.models import CustomUser
from merchant.fake import create_merchant, create_merchant_notes
from simplecrud.fake import create_person
from users.fake import create_user


class Command(BaseCommand):
    help = "Populate database with test objects"
    placeholders_dir = "saleor/static/placeholders/"

    def add_arguments(self, parser):

        parser.add_argument(
            "--createsuperuser",
            action="store_true",
            dest="createsuperuser",
            default=False,
            help="Create admin account",
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
        if options["createsuperuser"]:
            credentials = {"email": "vlad@admin.com", "password": "123"}
            msg = self.create_superuser(credentials)
            self.stdout.write(msg)

        # create users
        for i in range(5):
            create_user()
        # create people
        for i in range(15):
            create_person()
        # create merchants
        for i in range(15):
            create_merchant()
        create_merchant_notes()
