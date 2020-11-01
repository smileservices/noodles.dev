from django.core.management.base import BaseCommand
from django.db import connection, models

from study_resource import models as res_models
from study_resource import fake
from users.models import CustomUser


class Command(BaseCommand):
    help = "Populate database with test objects"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            default=False,
            help="if true, will delete all, excepting staff users",
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

    def handle(self, *args, **options):
        if options['clear']:
            fake.clean()
        users = CustomUser.objects.all()
        # study resources
        fake.study_resources_bulk(options['resources'], users=users)
        self.stdout.write(" >> Created study resources: done")

        resources = res_models.StudyResource.objects.all()

        # reviews
        reviews = []
        fake.reviews_bulk(resources, users, options['reviews'])
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
