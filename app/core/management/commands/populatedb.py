from django.core.management.base import BaseCommand
from django.db import connection, models

from users.models import CustomUser
from study_resource import models as res_models
from users import fake as fake_users
import study_resource.fake as fake_res


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
            "--users",
            type=int,
            default=50,
            help="How many users",
        )
        parser.add_argument(
            "--resources",
            type=int,
            default=250,
            help="How many resources",
        )
        parser.add_argument(
            "--reviews",
            type=int,
            default=500,
            help="How many reviews",
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

        staff = CustomUser.objects.filter(models.Q(is_staff=True) | models.Q(is_superuser=True))
        CustomUser.objects.exclude(pk__in=staff).delete()
        self.stdout.write("Removed all users except staff users")
        self.stdout.write('Cleaning all resources ... ')
        fake_res.clean()
        self.stdout.write('Tabula Rasa!')
        fake_res.initial_data()
        self.stdout.write('Populated with initial data - tags/technologies')

        # create users
        fake_users.create_bulk_users(options['users'])
        self.stdout.write(" >> Created users: done")
        users = CustomUser.objects.all()

        # study resources
        fake_res.study_resources_bulk(options['resources'], users=users)
        self.stdout.write(" >> Created study resources: done")

        resources = res_models.StudyResource.objects.all()

        # reviews
        reviews = []
        fake_res.reviews_bulk(resources, users, options['reviews'])
        self.stdout.write(" >> Created study resources reviews: done")

        # # rate reviews
        # for user in users:
        #     for review in choices(reviews, k=randint(0, 30)):
        #         try:
        #             choice([
        #                 lambda r, u: review.vote_up(u),
        #                 lambda r, u: review.vote_down(u),
        #             ])(review, user)
        #         except ValidationError:
        #             pass
        # self.stdout.write(" >> Rated reviews: done")
        #
        # # create collections
        # for user in choices(users, k=5):
        #     for _ in range(1, 4):
        #         new_collection(user)
        # self.stdout.write(" >> Create collections: done")
