from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse

from tag.models import Tag
from technology.models import Technology
from technology.fake import create_technologies
from users.models import CustomUser
from users.fake import create_user
from problem_solution.models import Problem, Solution
from random import choice, choices

PROBLEM_VIEWSET_URL = reverse('problem-viewset-list')
SOLUTION_VIEWSET_URL = reverse('solution-viewset-list')


class DjangoRestViews(APITestCase):

    def setUp(self) -> None:
        # create tags and technologies
        CustomUser.objects.bulk_create([create_user() for _ in range(0, 5)])
        for t in ['t1', 't2', 't3']:
            Tag.objects.create(name=t)
        create_technologies()

        self.users = CustomUser.objects.all()
        self.tags = Tag.objects.all()
        self.technologies = Technology.objects.all()

    def test_problem_solutions(self):
        '''
            Each problem can have many solutions
        '''
        self.client.force_login(user=self.users[0])
        response_pb = self.client.post(
            PROBLEM_VIEWSET_URL,
            {
                'name': 'problem 1',
                'description': 'bla bla',
                'tags': [self.tags[1].pk, self.tags[2].pk]
            },
            format='json'
        )
        self.assertEqual(response_pb.status_code, 201)
        response_pb_get = self.client.get(reverse('problem-viewset-detail', kwargs={'pk': response_pb.data['pk']}))
        self.assertEqual(len(response_pb_get.data['tags']), 2)

        response_sol = self.client.post(
            SOLUTION_VIEWSET_URL,
            {
                'name': 'solution to problem 1',
                'description': 'bla bla',
                'parent': response_pb.data['pk'],
                'tags': [self.tags[1].pk, self.tags[2].pk],
                'technologies': [self.technologies[1].pk, ]
            },
            format='json'
        )
        self.assertEqual(response_sol.status_code, 201)
        response_sol_get = self.client.get(reverse('solution-viewset-detail', kwargs={'pk': response_sol.data['pk']}))
        self.assertEqual(len(response_sol_get.data['tags']), 2)
        self.assertEqual(len(response_sol_get.data['technologies']), 1)
        self.assertEqual(response_sol_get.data['parent']['pk'], response_pb.data['pk'])
