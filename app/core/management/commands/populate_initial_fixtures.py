from django.core.management.base import BaseCommand

from django.db import connection, models
from django.template.defaultfilters import slugify
from random import randint, choice, choices
from core.elasticsearch.elasticsearch_interface import ElasticSearchInterface
from category.fake import clean_categories, create_categories
from tag.fake import clean_tags, create_tags
from users.models import CustomUser
from users import fake as fake_users
from allauth.socialaccount.models import EmailAddress
from technology import fake as fake_tech
# from problem_solution import fake as fake_problem_solution
from study_collection import fake as fake_collections
from study_resource import fake as fake_study_resource
from study_resource import fake_internal as fake_study_resource_internal

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
            username=credentials["username"],
            defaults={"is_active": True, "is_staff": True, "is_superuser": True},
        )
        if created:
            user.set_password(credentials["password"])
            user.save()
            msg = "Superuser - %(email)s/%(password)s" % credentials
        else:
            msg = "Superuser already exists - %(email)s" % credentials
        return msg

    def create_verified_user(self):
        self.stdout.write('Creating test user ... ')
        email_address = 'test@mail.com'
        user = CustomUser.objects.create(
            email=email_address,
            username='test_user',
            first_name='Test',
            last_name='User',
            is_active=True
        )
        user.set_password('123')
        user.save()
        EmailAddress.objects.create(user=user, email=email_address, verified=True, primary=True)
        self.stdout.write('Created test user -- username: test_user, email: test@user.com, password: 123')

    def handle(self, *args, **options):
        self.make_database_faster()

        if options['clear']:

            self.stdout.write('Cleaning elasticsearch indices ... ')
            ElasticSearchInterface.clean()
            self.stdout.write('Cleaning all resources ... ')
            fake_collections.clean()
            fake_study_resource.clean()
            fake_study_resource_internal.clean()
            clean_tags()
            fake_tech.clean_technologies()
            clean_categories()
            CustomUser.objects.all().delete()
            self.stdout.write("Removed all p/s/sr/t/techs and users!")
            credentials = {"email": "vlad@admin.com", "password": "123", "username":"vlad"}
            msg = self.create_superuser(credentials)
            self.stdout.write(msg)
            self.stdout.write(f'Created super user with creds {credentials}')
            self.create_verified_user()

        # create users
        fake_users.create_bulk_users(options['users'])
        self.stdout.write(" >> Created users: done")

        fake_tech.create_technologies_from_fixtures()
        self.stdout.write(" >> Created technologies from fixtures: done")

        # create edit suggestions
        fake_tech.create_technology_edit_suggestions()
        self.stdout.write(" >> Created technologies edit suggestions: done")

        create_tags()
        self.stdout.write(" >> Created tags: done")
        # resources, reviews
        fake_study_resource.study_resources_bulk()
        fake_study_resource.study_resources_edits_bulk(100)
        fake_study_resource.reviews_bulk()
        #study resource internal
        fake_study_resource_internal.study_resources_bulk()
        fake_study_resource_internal.study_resources_edits_bulk(100)
        fake_study_resource_internal.reviews_bulk()
        #collections
        fake_collections.collections_bulk()
        self.stdout.write(" >> Created study resources, internal study resource, edit suggestions, reviews, collections: done")

        # vote
        fake_tech.bulk_votes(30)
        fake_collections.bulk_votes(30)