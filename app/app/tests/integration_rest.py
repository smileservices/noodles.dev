from rest_framework.test import APITestCase
from django.urls import reverse
from random import choice, choices
from users.models import CustomUser
from users.fake import create_bulk_users, create_user_single, CustomUser
from technology.models import Technology
from tag.models import Tag
from tag.fake import create_tags
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

    def test_resource_delete(self):
        """
            testing core.ResourceViewset that prevents resource being deleted
             by anyone other than author or staff
        """
        user_resource_author = create_user_single()
        user_edit_suggestion_author = create_user_single()
        user_cannot_delete = create_user_single()
        user_staff = create_user_single(staff=True)

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
        self.assertEqual(response_pb.status_code, 201)
        self.client.force_login(user=user_edit_suggestion_author)
        url = reverse('problem-viewset-edit-suggestion-create', kwargs={'pk': response_pb.data['pk']})
        response_ed_pub_1 = self.client.post(
            url,
            {
                'name': 'edit for delete by staff',
                'description': 'bla bla',
                'tags': [self.tags[3].pk, ],
                'edit_suggestion_reason': 'test delete'
            },
            format='json'
        )
        response_ed_pub_2 = self.client.post(
            url,
            {
                'name': 'edit for delete by owner',
                'description': 'bla bla',
                'tags': [self.tags[3].pk, ],
                'edit_suggestion_reason': 'test delete'
            },
            format='json'
        )
        self.assertEqual(response_ed_pub_1.status_code, 201)
        self.assertEqual(response_ed_pub_2.status_code, 201)

        # try delete pb and edit suggestion
        self.client.force_login(user=user_cannot_delete)
        res_del_cannot = self.client.delete(reverse('problem-viewset-detail', kwargs={'pk': response_pb.data['pk']}))
        self.assertEqual(res_del_cannot.status_code, 403)
        res_del_cannot = self.client.delete(
            reverse('problem-edit-suggestion-viewset-detail', kwargs={'pk': response_ed_pub_1.data['pk']}))
        self.assertEqual(res_del_cannot.status_code, 403)

        # delete by edit sugg owner is successfull
        self.client.force_login(user=user_edit_suggestion_author)
        res_del_can = self.client.delete(
            reverse('problem-edit-suggestion-viewset-detail', kwargs={'pk': response_ed_pub_2.data['pk']}))
        self.assertEqual(res_del_can.status_code, 204)

        # delete by staff is successfull
        self.client.force_login(user=user_staff)
        # delete edit suggestion by staff
        res_del_can = self.client.delete(
            reverse('problem-edit-suggestion-viewset-detail', kwargs={'pk': response_ed_pub_1.data['pk']}))
        self.assertEqual(res_del_can.status_code, 204)

        # delete resource
        res_del_can = self.client.delete(reverse('problem-viewset-detail', kwargs={'pk': response_pb.data['pk']}))
        self.assertEqual(res_del_can.status_code, 204)

    def test_direct_update_resource_limitations(self):
        """
            only resource author or staff can directly update resource
        """
        user_resource_author = create_user_single()
        user_cannot_update = create_user_single()
        user_staff = create_user_single(staff=True)

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

        # update results in edit suggestion being created
        self.client.force_login(user_cannot_update)
        res_update_cannot = self.client.put(
            reverse('problem-viewset-detail', kwargs={'pk': response_pb.data['pk']}),
            {'name': 'cannot edit', 'edit_suggestion_reason': 'some reason'},
            format='json'
        )
        self.assertEqual(res_update_cannot.status_code, 209)

        # can update
        self.client.force_login(user_resource_author)
        res_update_can = self.client.put(
            reverse('problem-viewset-detail', kwargs={'pk': response_pb.data['pk']}),
            {'name': 'updated by author', 'description': 'updated', 'tags': [self.tags[1].pk, self.tags[2].pk]},
            format='json'
        )
        self.assertEqual(res_update_can.status_code, 200)
        self.assertEqual(res_update_can.data['name'], 'updated by author')
        self.client.force_login(user_staff)
        res_update_can = self.client.put(
            reverse('problem-viewset-detail', kwargs={'pk': response_pb.data['pk']}),
            {'name': 'updated by staff', 'description': 'updated', 'tags': [self.tags[1].pk, self.tags[2].pk]},
            format='json'
        )
        self.assertEqual(res_update_can.status_code, 200)
        self.assertEqual(res_update_can.data['name'], 'updated by staff')

    def test_direct_update_edit_suggestion_limitations(self):
        """
            only resource author or staff can directly update resource
        """
        user_resource_author = create_user_single()
        user_edit_author = create_user_single()
        user_cannot_update = create_user_single()
        user_staff = create_user_single(staff=True)

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
        response_edit_sug = self.client.post(
            url,
            {
                'name': 'edit for delete by staff',
                'description': 'bla bla',
                'tags': [self.tags[3].pk, ],
                'edit_suggestion_reason': 'test delete'
            },
            format='json'
        )
        self.assertEqual(response_edit_sug.status_code, 201)

        # canot update
        self.client.force_login(user_cannot_update)
        res_update_cannot = self.client.put(
            reverse('problem-edit-suggestion-viewset-detail', kwargs={'pk': response_edit_sug.data['pk']}),
            {'name': 'updated by staff', 'description': 'updated', 'tags': [self.tags[1].pk, self.tags[2].pk]},
            format='json'
        )
        self.assertEqual(res_update_cannot.status_code, 403)

        # can update
        self.client.force_login(user_edit_author)
        res_update_can = self.client.put(
            reverse('problem-edit-suggestion-viewset-detail', kwargs={'pk': response_edit_sug.data['pk']}),
            {'name': 'updated by author', 'description': 'updated', 'tags': [self.tags[1].pk, self.tags[2].pk],
             'slug': 'haba-haba'},
            format='json'
        )
        self.assertEqual(res_update_can.status_code, 200)
        self.assertEqual(res_update_can.data['name'], 'updated by author')

        self.client.force_login(user_staff)
        res_update_can = self.client.put(
            reverse('problem-edit-suggestion-viewset-detail', kwargs={'pk': response_edit_sug.data['pk']}),
            {'name': 'updated by staff', 'description': 'updated', 'tags': [self.tags[1].pk, self.tags[2].pk],
             'slug': 'haba-haba'},
            format='json'
        )
        self.assertEqual(res_update_can.status_code, 200)
        self.assertEqual(res_update_can.data['name'], 'updated by staff')

    def test_create_study_resource(self):
        user_resource_author = create_user_single()
        self.client.force_login(user=user_resource_author)
        response_res = self.client.post(
            STUDY_RESOURCE_VIEWSET_URL,
            {
                'name': 'learning resource',
                'summary': 'bla bla bla',
                'publication_date': '2020-09-20',
                'published_by': 'google',
                'url': 'www.gibberish.com',
                'price': 0,
                'media': 0,
                'experience': 0,
                'tags': [self.tags[1].pk, self.tags[2].pk],
                'technologies': [
                    {
                        'pk': self.technologies[0].pk,
                        'version': '123',
                    },
                    {
                        'pk': self.technologies[1].pk,
                        'version': '',
                    },
                ]
            },
            format='json'
        )
        self.assertEqual(response_res.status_code, 201)
        return response_res.data['pk']

    def test_get_study_resource(self):
        resource_pk = self.test_create_study_resource()
        resource_get = self.client.get(
            reverse('study-resource-viewset-detail', kwargs={'pk': resource_pk})
        )
        self.assertEqual(resource_get.status_code, 200)
        # check that the technologies are getting through the pivot table
        self.assertEqual(resource_get.data['technologies'][0]['name'], self.technologies[0].name)
        self.assertEqual(resource_get.data['technologies'][0]['version'], '123')
        self.assertEqual(resource_get.data['technologies'][1]['name'], self.technologies[1].name)
        self.assertEqual(resource_get.data['technologies'][1]['version'], '')

    def test_create_study_resource_edit_suggestion(self):
        resource_pk = self.test_create_study_resource()
        edit_author = create_user_single()
        publish_admin = CustomUser.objects.create(email='admin@admin.com', is_staff=True)
        self.client.force_login(user=edit_author)
        edit_data = {
            'name': 'edited',
            'edit_suggestion_reason': 'test edit',
            'summary': 'bla bla bla',
            'publication_date': '2020-09-20',
            'published_by': 'google',
            'url': 'www.gibberish.com',
            'price': 0,
            'media': 0,
            'experience': 0,
            'tags': [self.tags[1].pk, self.tags[2].pk],
            'technologies': [
                {
                    'pk': self.technologies[2].pk,
                    'version': '123',
                },
            ]
        }
        res_edit = self.client.put(
            reverse('study-resource-viewset-detail', kwargs={'pk': resource_pk}),
            edit_data,
            format='json'
        )
        self.assertEqual(res_edit.status_code, 209)

        # test publish
        self.client.force_login(user=publish_admin)
        url = reverse('study-resource-viewset-edit-suggestion-publish', kwargs={'pk': resource_pk})
        res_publish = self.client.post(url, {'edit_suggestion_id': res_edit.data['pk']},
                                                  format='json')
        self.assertEqual(res_publish.status_code, 200)

        # test if publish changed the resource accordingly, especially the m2m through field
        resource = StudyResource.objects.get(pk=resource_pk)
        self.assertEqual(resource.name, edit_data['name'])
        resource_techs = resource.technologies.through.objects.filter(study_resource=resource.pk).all()
        self.assertEqual(resource_techs[0].technology, self.technologies[2])
        self.assertEqual(resource_techs[0].version, '123')