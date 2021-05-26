from rest_framework.test import APITestCase
from category.models import Category
from technology.models import Technology
from users.fake import create_user_single
from faker import Faker
from django.urls import reverse
import json
from .models import CategoryConcept, TechnologyConcept

f = Faker()


class TestConcepts(APITestCase):
    '''
    Should do integration testing for
    - crud through REST API
    - create/publish/reject edit suggestions
    '''

    def setUp(self) -> None:
        self.users = {
            'admin': create_user_single(staff=True),
            'normal': create_user_single()
        }
        root_categ = Category.objects.create(name='RootCategory', description=f.text(), parent=None)
        sub_categ = Category.objects.create(name='SubCategory', description=f.text(), parent=root_categ)
        technology = Technology.objects.create(
            name='Tech',
            description=f.text(),
            author=self.users['admin'],
            license=0,
            url=f.url(),
            owner=f.company(),
        )
        technology.category.add(sub_categ)
        self.technologies = {
            'root': technology
        }
        self.categories = {
            'root': root_categ,
            'sub': sub_categ,
        }

    def test_create_category_concept(self):
        '''
        user login
        user create root concept for root category
        user create sub concept with parent=root in sub category
        '''
        self.client.force_login(user=self.users['normal'])
        res = self.client.post(
            reverse('concept-category-viewset-list'),
            {
                'name': 'category',
                'description': f.text(),
                'category': self.categories['root'].pk,
                'experience_level': 0,
                'meta': ''
            }
        )
        self.assertEqual(201, res.status_code)
        res_root = self.client.post(
            reverse('concept-category-viewset-list'),
            {
                'name': 'category',
                'description': f.text(),
                'category': self.categories['root'].pk,
                'experience_level': 0,
                'meta': ''
            }
        )
        self.assertEqual(201, res_root.status_code)
        res_sub = self.client.post(
            reverse('concept-category-viewset-list'),
            {
                'name': 'sub',
                'description': f.text(),
                'category': self.categories['sub'].pk,
                'parent': res_root.data['pk'],
                'experience_level': 0,
                'meta': ''
            }
        )
        self.assertEqual(201, res_sub.status_code)
        self.assertEqual(res_root.data['pk'], res_sub.data['parent']['pk'])
        self.assertEqual('category > sub', res_sub.data['name_tree'])

    def test_create_technology_concept(self):
        '''
        user login
        user create root concept for category
        user create root concept for technology
        user create sub concept with parent=category concept
        '''
        category_concept = CategoryConcept.objects.create(
            name='category',
            description=f.text(),
            category=self.categories['root'],
            experience_level=0,
            author=self.users['admin']
        )
        self.client.force_login(user=self.users['normal'])
        res_root = self.client.post(
            reverse('concept-technology-viewset-list'),
            {
                'name': 'root tech concept',
                'description': f.text(),
                'technology': self.technologies['root'].pk,
                'experience_level': 0,
            }
        )
        self.assertEqual(201, res_root.status_code)
        res_sub = self.client.post(
            reverse('concept-technology-viewset-list'),
            {
                'name': 'sub tech concept',
                'description': f.text(),
                'technology': self.technologies['root'].pk,
                'parent': category_concept.pk,
                'experience_level': 0,
            }
        )
        self.assertEqual(201, res_sub.status_code)
        self.assertEqual(category_concept.pk, res_sub.data['parent']['pk'])

    def test_edit_suggest_category_concept(self):
        '''
        create a category concept
        user submits edit suggestion for each field
        check edit suggestion data
        admin publishes the edit suggestion
        check category concept is updated
        '''
        user_edit = create_user_single()
        parent_concept = CategoryConcept.objects.create(**{
            'name': 'parent',
            'author': self.users['normal'],
            'description': f.text(),
            'category': self.categories['root'],
            'experience_level': 0,
            'meta': ''
        })
        concept = CategoryConcept.objects.create(**{
                'name': 'category',
                'author': self.users['normal'],
                'description': f.text(),
                'category': self.categories['root'],
                'experience_level': 0,
                'meta': ''
            })
        self.client.force_login(user_edit)
        edit_submit_response = self.client.put(
            reverse('concept-category-viewset-detail', kwargs={'pk': concept.pk}),
            {
                'name': 'category edit',
                'description': f.text()+' edited',
                'category': self.categories['sub'].pk,
                'parent': parent_concept.pk,
                'experience_level': 1,
                'meta': '',
                'edit_suggestion_reason': 'testing out'
            }
        )
        self.assertEqual(209, edit_submit_response.status_code)
        # test publishing the change
        self.client.force_login(self.users['admin'])
        publish_response = self.client.post(
            reverse('concept-category-viewset-edit-suggestion-publish', kwargs={'pk': concept.pk}),
            {'edit_suggestion_id': edit_submit_response.data['pk']},
            format='json'
        )
        self.assertEqual(200, publish_response.status_code)
        concept.refresh_from_db()
        self.assertEqual(concept.name, 'category edit')
        self.assertEqual(concept.experience_level, 1)
        self.assertEqual(concept.category, self.categories['sub'])
        self.assertEqual(concept.parent, parent_concept)
