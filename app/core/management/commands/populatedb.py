from io import StringIO

from django.core.exceptions import ValidationError
from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db.utils import IntegrityError
from django.db import connection

from users.models import CustomUser
from users.fake import create_user
from study_resource.fake import initial_data, new_study_resource, new_study_resource_review, new_collection
from random import randint, choice, choices


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

        initial_data()

        # create users
        users = []
        for i in range(20):
            users.append(create_user())
        self.stdout.write(" >> Created users: done")

        # study resources
        study_resources = []
        for user in users:
            for _ in range(randint(0, 5)):
                study_resources.append(new_study_resource(user))
        self.stdout.write(" >> Created study resources: done")

        # reviews
        reviews = []
        for user in users:
            for _ in range(randint(0,len(study_resources))):
                try:
                    review = new_study_resource_review(
                            study_resource=choice(study_resources),
                            user=user)
                    review.save()
                    reviews.append(review)
                except IntegrityError:
                    pass
        self.stdout.write(" >> Created study resources reviews: done")


        # rate reviews
        for user in users:
            for review in choices(reviews, k=randint(0, 30)):
                try:
                    choice([
                        lambda r,u: review.vote_up(u),
                        lambda r,u: review.vote_down(u),
                    ])(review, user)
                except ValidationError:
                    pass
        self.stdout.write(" >> Rated reviews: done")

        # create collections
        for user in choices(users, k=5):
            for _ in range(1,4):
                new_collection(user)
        self.stdout.write(" >> Create collections: done")


