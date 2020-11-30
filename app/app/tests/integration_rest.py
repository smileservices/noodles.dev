from rest_framework.test import APITestCase
from django.urls import reverse
from random import choice, choices
from users.models import CustomUser
from users.fake import create_bulk_users, create_user_single
from technology.models import Technology
from tag.models import Tag
from tag.fake import create_tags
from technology.fake import create_technologies
from problem_solution.fake import create_problem, create_solution
from problem_solution.models import Problem, Solution
from app.settings import rewards

PROBLEM_VIEWSET_URL = reverse('problem-viewset-list')
SOLUTION_VIEWSET_URL = reverse('solution-viewset-list')


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
        create_bulk_users(5)
        create_tags()
        create_technologies()
        self.tags = Tag.objects.all()
        # self.users = CustomUser.objects.all()
        self.technologies = Technology.objects.all()

    def test_problem_votable_rewards(self):
        """
        create root problem with certain user
        create edit suggestion with original user
        other user can vote; check user score change
        """
        p_u = create_user_single()
        g_u = create_user_single()

        self.client.force_login(user=p_u)
        c_r = self.client.post(PROBLEM_VIEWSET_URL,
                               {'name': 'problem 1', 'description': 'test', 'tags': [self.tags[1].pk, ]},
                               format='json')
        self.assertEqual(c_r.status_code, 201)
        p_u = CustomUser.objects.get(pk=p_u.pk)
        self.assertEqual(p_u.positive_score, rewards.RESOURCE_CREATE)

        self.client.force_login(user=g_u)
        vote_url = reverse('problem-viewset-vote', kwargs={'pk': c_r.data['pk']})
        res = self.client.post(
            vote_url,
            {'vote': 1},
            format='json'
        )
        self.assertEqual(res.status_code, 200)
        p = Problem.objects.get(pk=c_r.data['pk'])
        p_u = CustomUser.objects.get(pk=p_u.pk)
        self.assertEqual(p.thumbs_up, 1)
        self.assertEqual(p_u.positive_score, rewards.RESOURCE_CREATE + 1)

    def test_problem_edit_suggestion_vote(self):
        """
        user 0 - creates problem
        user 1 - creates edit suggestion
        user 2 - votes edit suggestion

        outcome:
        user 1 positive_score == 1
        """
        user_resource_author = create_user_single()
        user_edit_author = create_user_single()
        user_voter = create_user_single()

        self.client.force_login(user=user_resource_author)
        response_pb = self.client.post(
            PROBLEM_VIEWSET_URL,
            {
                'name': 'problem 1',
                'description': 'bla bla',
                'tags': [self.tags[1].pk, self.tags[2].pk]
            },
            format='json'
        )
        self.client.force_login(user=user_edit_author)
        url = reverse('problem-viewset-edit-suggestion-create', kwargs={'pk': response_pb.data['pk']})
        response_ed_sug = self.client.post(
            url,
            {
                'name': 'edited',
                'description': 'bla bla',
                'tags': [self.tags[3].pk, ],
                'edit_suggestion_reason': 'test'
            },
            format='json'
        )
        self.assertEqual(response_ed_sug.status_code, 201)

        # users vote on ed sug
        self.client.force_login(user=user_voter)
        url = reverse('problem-edit-suggestion-viewset-vote', kwargs={'pk': response_ed_sug.data['pk']})
        response_ed_sug_vote = self.client.post(
            url,
            {'vote': 1},
            format='json'
        )
        self.assertEqual(response_ed_sug_vote.status_code, 200)

        # check voting outcome for user 1 and his edit suggestion
        eds_i = Problem.objects.get(pk=response_pb.data['pk']).edit_suggestions.latest()
        self.assertEquals(eds_i.thumbs_up, 1)

        es_u = CustomUser.objects.get(pk=user_edit_author.pk)
        self.assertEquals(es_u.positive_score, 1)

    def test_problem_edit_suggestion_publish_reject(self):
        """
        user 0 - creates problem
        user 1 - creates edit suggestion
        user 2 - creates edit suggestion
        user 3 - tries to publish/reject unsuccessfully
        user 4 - publish es 1, reject es2

        user 4 positive rating > threshold for moderation

        outcome:
        es published
        user edit 1 positive_score == reward for publish
        es rejected
        user edit 2 negative_score == punish for reject
        """
        user_resource_author = create_user_single()
        user_edit_author_1 = create_user_single()
        user_edit_author_2 = create_user_single()
        user_cannot_publish = create_user_single()
        user_can_publish = create_user_single()

        user_can_publish.positive_score = rewards.MODERATOR_USER_SCORE
        user_can_publish.save()

        self.client.force_login(user=user_resource_author)
        response_pb = self.client.post(
            PROBLEM_VIEWSET_URL,
            {
                'name': 'problem 1',
                'description': 'bla bla',
                'tags': [self.tags[1].pk, self.tags[2].pk]
            },
            format='json'
        )
        self.client.force_login(user=user_edit_author_1)
        url = reverse('problem-viewset-edit-suggestion-create', kwargs={'pk': response_pb.data['pk']})
        response_ed_pub = self.client.post(
            url,
            {
                'name': 'edit for publish',
                'description': 'bla bla',
                'tags': [self.tags[3].pk, ],
                'edit_suggestion_reason': 'test publish'
            },
            format='json'
        )
        self.assertEqual(response_ed_pub.status_code, 201)

        self.client.force_login(user=user_edit_author_2)
        url = reverse('problem-viewset-edit-suggestion-create', kwargs={'pk': response_pb.data['pk']})
        response_ed_rej = self.client.post(
            url,
            {
                'name': 'edit for reject',
                'description': 'bla bla',
                'tags': [self.tags[3].pk, ],
                'edit_suggestion_reason': 'test rejection'
            },
            format='json'
        )
        self.assertEqual(response_ed_rej.status_code, 201)

        # users try to publish/reject
        self.client.force_login(user=user_cannot_publish)
        # publish unsuccessful
        url = reverse('problem-viewset-edit-suggestion-publish', kwargs={'pk': response_pb.data['pk']})
        res_publish_unsuccessful = self.client.post(url, {'edit_suggestion_id': response_ed_pub.data['pk']},
                                                    format='json')
        self.assertEqual(res_publish_unsuccessful.status_code, 403)
        # reject unsuccessful
        url = reverse('problem-viewset-edit-suggestion-reject', kwargs={'pk': response_pb.data['pk']})
        res_reject_unsuccessful = self.client.post(url, {'edit_suggestion_id': response_ed_rej.data['pk'],
                                                         'edit_suggestion_reject_reason': 'test cannot publish'},
                                                   format='json')
        self.assertEqual(res_reject_unsuccessful.status_code, 403)

        self.client.force_login(user=user_can_publish)
        # publish successful
        url = reverse('problem-viewset-edit-suggestion-publish', kwargs={'pk': response_pb.data['pk']})
        res_publish_successful = self.client.post(url, {'edit_suggestion_id': response_ed_pub.data['pk']},
                                                  format='json')
        self.assertEqual(res_publish_successful.status_code, 200)

        # reject successful
        url = reverse('problem-viewset-edit-suggestion-reject', kwargs={'pk': response_pb.data['pk']})
        res_reject_successful = self.client.post(url, {'edit_suggestion_id': response_ed_rej.data['pk'],
                                                       'edit_suggestion_reject_reason': 'test cannot publish'},
                                                 format='json')
        self.assertEqual(res_reject_successful.status_code, 200)
        user_1 = CustomUser.objects.get(pk=user_edit_author_1.pk)
        user_2 = CustomUser.objects.get(pk=user_edit_author_2.pk)
        self.assertEqual(user_1.positive_score, rewards.EDIT_SUGGESTION_PUBLISH)
        self.assertEqual(user_2.negative_score, rewards.EDIT_SUGGESTION_REJECT)
