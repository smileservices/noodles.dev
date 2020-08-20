"""Clear the database preserving shop's configuration.

This command clears the database from data such as orders, products or customer
accounts. It doesn't remove shop's configuration, such as: staff accounts, service
accounts, plugin configurations, site settings or navigation menus.
"""
import shutil
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db.models import Q
from users.models import CustomUser
from study_resource.fake import clean as clean_study_resource


class Command(BaseCommand):
    help = "Removes data from the database preserving shop configuration."

    def add_arguments(self, parser):
        parser.add_argument(
            "--delete-staff",
            action="store_true",
            help="Delete staff user accounts (doesn't delete superuser accounts).",
        )
        parser.add_argument(
            "--force",
            action="store_true",
            help="Allows running the cleardb command in DEBUG=False mode.",
        )

    def handle(self, **options):
        force = options.get("force", False)
        if not settings.DEBUG and not force:
            raise CommandError("Cannot clear the database in DEBUG=False mode.")
        if options.get("delete_all"):
            CustomUser.objects.all().delete()
            self.stdout.write("Removed all users")
        else:
            staff = CustomUser.objects.filter(Q(is_staff=True) | Q(is_superuser=True))
            CustomUser.objects.exclude(pk__in=staff).delete()
            self.stdout.write("Removed all except staff users")

        clean_study_resource()
        self.stdout.write("Cleaned study_resource app")



