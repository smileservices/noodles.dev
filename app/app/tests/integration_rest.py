import json
from rest_framework.test import APITestCase, APISimpleTestCase
from unittest.mock import patch
from django.urls import reverse
from random import choice, choices
from users.models import CustomUser
from users.fake import create_bulk_users, create_user_single, CustomUser
from technology.models import Technology
from tag.models import Tag
from tag.fake import create_tags
from category.fake import create_categories
from concepts.fake import clean_concepts, create_category_concept, create_technology_concept
from category.models import Category
from study_collection.models import Collection
from technology.fake import create_technologies
from app.settings import rewards

from faker import Faker

fake = Faker()

from study_resource.models import StudyResource

COLLECTION_VIEWSET_URL = reverse('collection-viewset-list')
STUDY_RESOURCE_VIEWSET_URL = reverse('study-resource-viewset-list')


class RestIntegrationTest(APITestCase):
    """
    integration testing of rest endpoints
    - tag
    - technology
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
        create_categories()
        create_tags()
        create_technologies()
        self.category_concept = create_category_concept('cat concept', Category.objects.first(),
                                                        CustomUser.objects.first())
        self.technology_concept = create_technology_concept('tech concept', Technology.objects.first(),
                                                            CustomUser.objects.first())
        self.tags = Tag.objects.all()
        self.categories = Category.objects.all()
        self.technologies = Technology.objects.all()

    def test_collection_votable_rewards(self):
        """
        create root problem with certain user
        create edit suggestion with original user
        other user can vote; check user score change
        """
        p_u = create_user_single()
        g_u = create_user_single()

        self.client.force_login(user=p_u)
        c_r = self.client.post(
            COLLECTION_VIEWSET_URL,
            {
                'name': 'collection 1',
                'description': 'test',
                'tags': [self.tags[1].pk, ]
            },
            format='json')
        self.assertEqual(c_r.status_code, 201)
        self.client.force_login(user=g_u)
        vote_url = reverse('collection-viewset-vote', kwargs={'pk': c_r.data['pk']})
        res = self.client.post(
            vote_url,
            {'vote': 1},
            format='json'
        )
        self.assertEqual(res.status_code, 200)
        p = Collection.objects.get(pk=c_r.data['pk'])
        p_u.refresh_from_db()
        self.assertEqual(p.thumbs_up, 1)
        self.assertEqual(p_u.positive_score, 1)

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
                'url': fake.url(),
                'category_concepts': '{}',
                'technology_concepts': '{}',
                'price': 0,
                'media': 0,
                'experience': 0,
                'category': self.categories[0].pk,
                'tags': json.dumps([self.tags[1].pk, self.tags[2].pk]),
                'technologies': json.dumps([
                    {
                        'technology_id': self.technologies[0].pk,
                        'version': '123',
                    },
                    {
                        'technology_id': self.technologies[1].pk,
                        'version': 0,
                    },
                ])
            },
            format='multipart'
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
        self.assertEqual(resource_get.data['category']['label'], self.categories[0].name)
        self.assertEqual(resource_get.data['technologies'][1]['name'], self.technologies[0].name)
        self.assertEqual(resource_get.data['technologies'][1]['version'], 123.0)
        self.assertEqual(resource_get.data['technologies'][0]['name'], self.technologies[1].name)
        self.assertEqual(resource_get.data['technologies'][0]['version'], 0.0)

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
            'category_concepts': '{}',
            'technology_concepts': '{}',
            'url': fake.url(),
            'price': 0,
            'media': 0,
            'experience': 0,
            'category': choice(self.categories).pk,
            'tags': json.dumps([self.tags[1].pk, self.tags[2].pk]),
            'technologies': json.dumps([
                {
                    'technology_id': self.technologies[2].pk,
                    'version': 123.4,
                },
            ])
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
        self.assertEqual(resource_techs[0].version, 123.4)

    @patch('study_resource.scrape.main.scrape_tutorial')
    def test_study_resource_intermediary_new_url(self, mocked_scrape_function):
        '''
        Validate url endpoint creates a resource intermediary and stores the scraped data there
        todo must find a way to properly mock the scrape_tutorial
        '''
        mocked_scrape_function.return_value = {'scraped': True}
        author = create_user_single()
        self.client.force_login(author)
        good_response = self.client.post(
            STUDY_RESOURCE_VIEWSET_URL+'validate_url/',
            {'url': 'www.test-url.test'},
            format='json'
        )
        self.assertEqual(good_response.status_code, 200)
        self.assertEqual(good_response.data['scraped_data'], {'scraped': True})
        self.assertEqual(good_response.data['status'], 0)

    @patch('study_resource.scrape.main.scrape_tutorial')
    def test_study_resource_intermediary_existing_url(self, mocked_scrape_function):
        '''
        Validate url not allow other user to add the same url if it's pending and is active for less than 5 minutes
        but will return the intermediary if it's the same author
        '''
        mocked_scrape_function.return_value = {'scraped': True}
        author = create_user_single()
        other_user = create_user_single()
        self.client.force_login(author)
        first_response = self.client.post(
            STUDY_RESOURCE_VIEWSET_URL+'validate_url/',
            {'url': 'www.test-url.test'},
            format='json'
        )
        self.assertEqual(first_response.status_code, 200)
        second_response = self.client.post(
            STUDY_RESOURCE_VIEWSET_URL + 'validate_url/',
            {'url': 'www.test-url.test'},
            format='json'
        )
        self.assertEqual(second_response.status_code, 200)
        self.assertEqual(second_response.data['scraped_data'], {'scraped': True})
        self.assertEqual(second_response.data['status'], 0)

        self.client.force_login(other_user)
        third_response = self.client.post(
            STUDY_RESOURCE_VIEWSET_URL + 'validate_url/',
            {'url': 'www.test-url.test'},
            format='json'
        )
        self.assertEqual(third_response.status_code, 400)
        self.assertEqual(third_response.data['error'], True)

