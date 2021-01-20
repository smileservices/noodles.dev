from rest_framework.test import APITestCase
from django.urls import reverse
from random import choice, choices
from users.models import CustomUser
from users.fake import create_bulk_users, create_user_single, CustomUser
from technology.models import Technology
from tag.models import Tag
from tag.fake import create_tags
from category.fake import create_categories
from category.models import Category
from technology.fake import create_technologies
from problem_solution.fake import create_problem, create_solution
from problem_solution.models import Problem, Solution
from app.settings import rewards

from study_resource.models import StudyResource

PROBLEM_VIEWSET_URL = reverse('problem-viewset-list')
SOLUTION_VIEWSET_URL = reverse('solution-viewset-list')
STUDY_RESOURCE_VIEWSET_URL = reverse('study-resource-viewset-list')


class RestIntegrationTest(APITestCase):
    """
    integration testing of rest endpoints
    - tag
    - technology
    - problem
    - solution
    - learning resource
    - review - create/delete check author rating
    - voting

    Rewards:
    -------
    - user vote up, publish edit suggestion  - user positive action ++
    - user vote down, reject edit suggestion - user positive action --
    - someone votes +/- a resource, edit suggestion, the resource author gets positive/negative rating
    - an edit suggestion gets published/rejected, the author gets positive/negative rating
    """

    def setUp(self) -> None:
        print('set up')
        create_bulk_users(5)
        create_categories()
        create_tags()
        create_technologies()
        self.tags = Tag.objects.all()
        self.categories = Category.objects.all()
        self.technologies = Technology.objects.all()
        print([c.pk for c in self.categories])

    def tearDown(self) -> None:
        print('tear down')
        print([c.pk for c in self.categories])

    def test_a(self):
        print('a')
        print([c.pk for c in self.categories])
        self.assertEqual(1,1)

    def test_b(self):
        print('b')
        print([c.pk for c in self.categories])
        self.assertEqual(2, 2)

    def test_c(self):
        print('c')
        print([c.pk for c in self.categories])
        self.assertEqual(2, 2)
