from django.test import TestCase
from rest_framework.test import APITestCase
from django.urls import reverse
from random import choice
from tag.models import Tag
from technology.models import Technology
from .models import Solution, Problem
from technology.fake import create_technologies
from users.models import CustomUser
from users.fake import create_user, create_user_single
from category.fake import create_categories
from category.models import Category
from .fake import create_problem, create_solution
from app.settings import rewards

PROBLEM_VIEWSET_URL = reverse('problem-viewset-list')
SOLUTION_VIEWSET_URL = reverse('solution-viewset-list')


class DjangoRestViews(APITestCase):

    def setUp(self) -> None:
        # create tags and technologies
        for t in ['t1', 't2', 't3']:
            Tag.objects.create(name=t)
        create_categories()
        create_technologies()
        self.categories = Category.objects.all()
        self.tags = Tag.objects.all()
        self.technologies = Technology.objects.all()

    def test_problem_solutions(self):
        '''
            Each problem can have many solutions
        '''
        user_resource_author = create_user_single()
        self.client.force_login(user=user_resource_author)
        response_pb = self.client.post(
            PROBLEM_VIEWSET_URL,
            {
                'name': 'problem 1',
                'description': 'bla bla',
                'category': choice(self.categories).pk,
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
                'category': choice(self.categories).pk,
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

    def test_problem_edit_suggestion_parent(self):
        """
            parent should be edited through edit suggestion
            1. user author creates resource
            2. user edit created edit suggestion containing parent and parent_id fields
            3. user edit publishes edit suggestion
            4. updated resource parent is changed
        """
        user_resource_author = create_user_single()
        user_edit_author = create_user_single()
        user_can_publish = create_user_single()

        user_can_publish.positive_score = rewards.MODERATOR_USER_SCORE
        user_can_publish.save()

        root_problem = create_problem()
        solution_1 = create_solution(problem=root_problem)
        solution_2 = create_solution(problem=root_problem)

        tag = Tag.objects.create(name='tag')

        self.client.force_login(user=user_resource_author)
        response_pb = self.client.post(
            PROBLEM_VIEWSET_URL,
            {
                'name': 'problem 1',
                'description': 'bla bla',
                'category': choice(self.categories).pk,
                'parent': solution_1.pk,
                'tags': [tag.pk,]
            },
            format='json'
        )
        self.assertEqual(response_pb.data['parent']['pk'], solution_1.pk)

        # create the edit suggestion
        self.client.force_login(user=user_edit_author)
        url = reverse('problem-viewset-detail', kwargs={'pk': response_pb.data['pk']})
        response_ed_pub = self.client.put(
            url,
            {
                'name': 'edited',
                'description': 'edited',
                'parent': solution_2.pk,
                'tags': [tag.pk, ],
                'category': choice(self.categories).pk,
                'edit_suggestion_reason': 'test parent edit'
            },
            format='json'
        )
        self.assertEqual(response_ed_pub.status_code, 209)

        # publish
        self.client.force_login(user=user_can_publish)
        url = reverse('problem-viewset-edit-suggestion-publish', kwargs={'pk': response_pb.data['pk']})
        res_publish = self.client.post(url, {'edit_suggestion_id': response_ed_pub.data['pk']},
                                       format='json')
        self.assertEqual(res_publish.status_code, 200)

        # check if the updated problem has the same parent
        updated_pb = Problem.objects.get(pk=response_pb.data['pk'])
        self.assertEqual(updated_pb.parent, solution_2)

    def test_solution_edit_suggestion_parent(self):
        """
            parent should be edited through edit suggestion
            1. user author creates resource
            2. user edit created edit suggestion containing parent and parent_id fields
            3. user edit publishes edit suggestion
            4. updated resource parent is changed
        """
        user_resource_author = create_user_single()
        user_edit_author = create_user_single()
        user_can_publish = create_user_single()

        user_can_publish.positive_score = rewards.MODERATOR_USER_SCORE
        user_can_publish.save()

        problem_1 = Problem.objects.create(author=user_resource_author, name='prob 1', slug='prob-1',description='some descr')
        problem_2 = Problem.objects.create(author=user_resource_author, name='prob 2', slug='prob-1',description='some descr')

        tag = Tag.objects.create(name='tag')

        self.client.force_login(user=user_resource_author)
        response_sol = self.client.post(
            SOLUTION_VIEWSET_URL,
            {
                'name': 'solution to problem 1',
                'description': 'bla bla',
                'parent': problem_1.pk,
                'tags': [tag.pk, ],
                'category': choice(self.categories).pk,
                'technologies': [self.technologies[1].pk, ]
            },
            format='json'
        )
        self.assertEqual(response_sol.status_code, 201)
        self.assertEqual(response_sol.data['parent']['pk'], problem_1.pk)

        # create edit
        self.client.force_login(user_edit_author)
        edit_res = self.client.put(
            reverse('solution-viewset-detail', kwargs={'pk': response_sol.data['pk']}),
            {
                'name': 'solution to problem 1',
                'description': 'bla bla',
                # just change parent
                'parent': problem_2.pk,
                'tags': [tag.pk, ],
                'category': choice(self.categories).pk,
                'technologies': [self.technologies[1].pk, ],
                'edit_suggestion_reason': 'edit parent'
            },
            format='json'
        )
        self.assertEqual(edit_res.status_code, 209)

        # publish
        self.client.force_login(user=user_can_publish)
        res_publish = self.client.post(
            reverse('solution-viewset-edit-suggestion-publish', kwargs={'pk': response_sol.data['pk']}),
            {
                'edit_suggestion_id': edit_res.data['pk']
            },
            format='json'
        )
        self.assertEqual(res_publish.status_code, 200)

        # check if the updated problem has the same parent
        updated_pb = Solution.objects.get(pk=response_sol.data['pk'])
        self.assertEqual(updated_pb.parent, problem_2)
