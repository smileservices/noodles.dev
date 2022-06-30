import json
from rest_framework.test import APITestCase
from rest_framework.test import force_authenticate
from rest_framework.test import APIClient

from django.urls import reverse
from random import choice, choices
from users.fake import create_bulk_users, create_user_single, CustomUser
from technology.models import Technology
from technology.fake import create_technologies
from category.fake import create_categories
from category.models import Category
from category.serializers import CategorySerializerOption
from app.settings import rewards
from django.urls import reverse
from core.status import HTTP_209_EDIT_SUGGESTION_CREATED
from faker import Faker

fake = Faker()

TECHNOLOGY_VIEWSET_URL = reverse('techs-viewset-list')
TECHNOLOGY_DETAIL_URL = 'techs-viewset-detail'
TECHNOLOGY_EDIT_SUGGESTION_ENDPOINT = 'techs-viewset-edit-suggestion'
STUDY_RESOURCE_VIEWSET_URL = reverse('study-resource-viewset-list')


class TechnologyIntegrationTesting(APITestCase):
    """
    integration testing of rest endpoints
    - create
    - edit
    - edit suggestion create
    - edit suggestion publish
    - edit suggestion reject
    - voting

    Rewards:
    -------
    - user create new technology
    - user vote up, publish edit suggestion  - user positive action ++
    - user vote down, reject edit suggestion - user positive action --
    - someone votes +/- a resource, edit suggestion, the resource author gets positive/negative rating
    - an edit suggestion gets published/rejected, the author gets positive/negative rating
    """

    def setUp(self) -> None:
        create_categories()
        self.categories = Category.objects.all()

    def _get_tech_data(self):
        return {
            'name': 'tech',
            'description': 'some description',
            'category': ','.join([str(id) for id in [self.categories[0].pk, self.categories[1].pk]]),
            'ecosystem': '',
            'category_concepts': '{}',
            'license': 0,
            'url': 'wwww.google.com',
            'owner': 'some owner',
            'meta': '{}'
        }

    def test_create(self):
        author = create_user_single()
        self.client.force_login(user=author)
        res = self.client.post(
            TECHNOLOGY_VIEWSET_URL,
            self._get_tech_data(),
            format='multipart'
        )
        self.assertEqual(res.status_code, 201)
        self.assertEqual(len(res.data['category']), 2)

    def test_update(self):
        author = create_user_single()
        self.client.force_login(user=author)
        tech_data = self._get_tech_data()
        res = self.client.post(
            TECHNOLOGY_VIEWSET_URL,
            tech_data,
            format='multipart'
        )
        self.assertEqual(res.status_code, 201)
        edited_data = {**tech_data}
        edited_data['pk'] = res.data['pk']
        edited_data['name'] = 'edited'
        edited_data['edit_suggestion_reason'] = 'test edit'
        edited_data['category'] = ','.join([str(id) for id in [self.categories[2].pk, self.categories[3].pk]])
        edit_res = self.client.put(
            reverse(TECHNOLOGY_DETAIL_URL, kwargs={'pk': res.data['pk']}),
            edited_data,
            format='multipart'
        )
        self.assertEqual(edit_res.status_code, 200)
        self.assertEqual(edit_res.data['name'], 'edited')
        self.assertEqual(edit_res.data['category'], CategorySerializerOption([self.categories[2], self.categories[3]], many=True).data)

    def test_edit_suggestion_create(self):
        author = create_user_single()
        edit_author = create_user_single()
        self.client.force_login(user=author)
        tech_data = self._get_tech_data()
        res = self.client.post(
            TECHNOLOGY_VIEWSET_URL,
            tech_data,
            format='multipart'
        )
        self.assertEqual(res.status_code, 201)
        self.client.force_login(user=edit_author)
        edited_data = {**tech_data}
        edited_data['pk'] = res.data['pk']
        edited_data['name'] = 'edited'
        edited_data['category'] = ','.join([str(id) for id in [self.categories[2].pk, self.categories[3].pk]])
        edited_data['edit_suggestion_reason'] = 'testing edit suggestions for technology'
        edit_res = self.client.put(
            reverse(TECHNOLOGY_DETAIL_URL, kwargs={'pk': res.data['pk']}),
            edited_data,
            format='multipart'
        )
        self.assertEqual(edit_res.status_code, HTTP_209_EDIT_SUGGESTION_CREATED)
        # check changes
        self.assertEqual(edit_res.data['changes'][0]['new'], 'edited')
        self.assertEqual(edit_res.data['changes'][1]['new'], ', '.join([self.categories[2].name_tree, self.categories[3].name_tree]))

    def test_edit_suggestion_publish(self):
        author = create_user_single()
        edit_author = create_user_single()
        self.client.force_login(user=author)
        tech_data = self._get_tech_data()
        res = self.client.post(
            TECHNOLOGY_VIEWSET_URL,
            tech_data,
            format='multipart'
        )
        self.assertEqual(res.status_code, 201)
        self.client.force_login(user=edit_author)
        edited_data = {**tech_data}
        edited_data['pk'] = res.data['pk']
        edited_data['name'] = 'edited'
        edited_data['category'] = ','.join([str(id) for id in [self.categories[2].pk, self.categories[3].pk]])
        edited_data['edit_suggestion_reason'] = 'testing edit suggestions for technology'
        edit_res = self.client.put(
            reverse(TECHNOLOGY_DETAIL_URL, kwargs={'pk': res.data['pk']}),
            edited_data,
            format='multipart'
        )
        self.assertEqual(edit_res.status_code, HTTP_209_EDIT_SUGGESTION_CREATED)
        # author publish
        self.client.force_login(user=author)
        url = reverse(TECHNOLOGY_EDIT_SUGGESTION_ENDPOINT+'-publish', kwargs={'pk': res.data['pk']})
        res_publish = self.client.post(url, {'edit_suggestion_id': edit_res.data['pk']},format='json')
        self.assertEqual(res_publish.status_code, 200)
        edited_tech = Technology.objects.get(pk=res.data['pk'])
        self.assertEqual(edited_tech.name, 'edited')
        self.assertEqual([c for c in edited_tech.category.all()], [self.categories[2], self.categories[3]])
        # check if edit author positive score is improved
        edit_author.refresh_from_db()
        self.assertEqual(edit_author.positive_score, rewards.EDIT_SUGGESTION_PUBLISH)

    def test_technology_attributes(self):
        author = create_user_single()
        client = APIClient()
        create_technologies()
        tech = Technology.objects.first()
        data = {
            "technology": tech.pk,
            "attribute_type": 0,
            "content": fake.text()
        }

        client.force_authenticate(user=author)
        response =  client.post(reverse('tech-attributes-viewset-list'), data, format="multipart")
        self.assertEqual(response.status_code, 201)
