import json
from rest_framework.test import APITestCase, APISimpleTestCase
from unittest.mock import patch
from django.urls import reverse
from users.fake import create_bulk_users, create_user_single, CustomUser
from concepts.fake import create_category_concept, create_technology_concept
from technology.fake import create_technologies
from category.fake import create_categories
from category.models import Category
from technology.models import Technology
from study_resource.fake import new_study_resource, new_study_resource_review
from .models import Notifications, Subscribers
from faker import Faker
from study_resource.fake import get_dummy_image

fake = Faker()


# important: study_resource has overwritten create view

def check_user_has_notification(user, test_instance, count=1):
    test_instance.client.force_login(user=user)
    notifications_response = test_instance.client.get(path=reverse('user-viewset-notifications'))
    test_instance.assertEquals(notifications_response.status_code, 200)
    test_instance.assertEquals(notifications_response.data['count'], count)


class SubscriptionsNotifications(APITestCase):

    def setUp(self) -> None:
        create_bulk_users(5)
        create_categories()
        self.users = CustomUser.objects.order_by('pk').all()
        self.category = Category.objects.first()
        self.resource = create_category_concept('concept', category=self.category, author=self.users[0])
        self.resource.subscribe(self.resource.author)
        self.resource_subscribe_url = reverse('concept-category-viewset-subscribe', kwargs={'pk': self.resource.pk})


    def test_subscription(self):
        # subscribe users to resource
        # subscribe users to category
        self.client.force_login(user=self.users[1])
        self.client.post(
            path=self.resource_subscribe_url,
            data={'action': 'subscribe'}
        )
        check_response = self.client.post(
            path=self.resource_subscribe_url,
            data={'action': 'check'}
        )
        self.assertTrue(check_response.data['subscribed'])
        self.client.post(
            path=self.resource_subscribe_url,
            data={'action': 'unsubscribe'}
        )
        check_response = self.client.post(
            path=self.resource_subscribe_url,
            data={'action': 'check'}
        )
        self.assertFalse(check_response.data['subscribed'])

    def test_notification_create(self):
        # user creates a resource
        # category subscriber receives 1 notification
        category_subscribers, created = self.category.subscribers.get_or_create()
        category_subscribers.users.append(self.users[1].pk)
        category_subscribers.save()
        self.client.force_login(user=self.users[2])
        create_response = self.client.post(path=reverse('concept-category-viewset-list'), data={
            "name": fake.text(15),
            "description": fake.text(150),
            "category": self.category.pk, "experience_level": 0,
            "description_long": fake.text(250)
        })
        self.assertEquals(create_response.status_code, 201)
        notifications_response = self.client.get(path=reverse('user-viewset-notifications'))
        self.assertEquals(notifications_response.status_code, 200)
        self.assertEquals(notifications_response.data['count'], 0)

        self.client.force_login(user=self.users[1])
        notifications_response = self.client.get(path=reverse('user-viewset-notifications'))
        self.assertEquals(notifications_response.status_code, 200)
        self.assertEquals(notifications_response.data['count'], 1)

    def test_notification_update(self):
        # user modifies the resource
        # resource subscribers receives 1 notification
        category_subscribers, created = self.category.subscribers.get_or_create()
        resource_subscribers, created = self.resource.subscribers.get_or_create()
        category_subscribers.users += [self.users[1].pk, self.users[2].pk, self.users[3].pk]
        resource_subscribers.users += [self.users[1].pk, self.users[2].pk]
        category_subscribers.save()
        resource_subscribers.save()

        # resource author updates the resource directly
        self.client.force_login(user=self.resource.author)
        update_response = self.client.put(
            path=reverse('concept-category-viewset-detail', kwargs={'pk': self.resource.pk}),
            data={
                "name": self.resource.name + ' edited',
                "description": self.resource.description,
                "category": self.category.pk, "experience_level": 0,
                "description_long": self.resource.description_long,
                'edit_suggestion_reason': 'testing'
            }
        )
        self.assertEquals(update_response.status_code, 200)

        # actor should receive no notification
        notifications_response = self.client.get(path=reverse('user-viewset-notifications'))
        self.assertEquals(notifications_response.data['count'], 0)

        self.client.force_login(user=self.users[1])
        notifications_response = self.client.get(path=reverse('user-viewset-notifications'))
        self.assertEquals(notifications_response.data['count'], 1)

        self.client.force_login(user=self.users[2])
        notifications_response = self.client.get(path=reverse('user-viewset-notifications'))
        self.assertEquals(notifications_response.data['count'], 1)

        self.client.force_login(user=self.users[3])
        notifications_response = self.client.get(path=reverse('user-viewset-notifications'))
        self.assertEquals(notifications_response.data['count'], 1)


    def test_notification_edit_suggestion_create(self):
        # user creates edit suggestion to the resource
        # resource subscribers receives 1 notification
        # edit author receives 0 notification
        category_subscribers, created = self.category.subscribers.get_or_create()
        resource_subscribers, created = self.resource.subscribers.get_or_create()
        category_subscribers.users += [self.users[1].pk, self.users[2].pk, self.users[3].pk]
        resource_subscribers.users += [self.users[1].pk, self.users[2].pk]
        category_subscribers.save()
        resource_subscribers.save()

        self.client.force_login(user=self.users[1])
        update_response = self.client.put(
            path=reverse('concept-category-viewset-detail', kwargs={'pk': self.resource.pk}),
            data={
                "name": self.resource.name + ' edited',
                "description": self.resource.description,
                "category": self.category.pk, "experience_level": 0,
                "description_long": self.resource.description_long,
                'edit_suggestion_reason': 'testing'
            }
        )
        self.assertEquals(update_response.status_code, 209)

        # actor should receive no notification
        notifications_response = self.client.get(path=reverse('user-viewset-notifications'))
        self.assertEquals(notifications_response.data['count'], 0)

        # resource author should receive notification
        self.client.force_login(user=self.resource.author)
        notifications_response = self.client.get(path=reverse('user-viewset-notifications'))
        self.assertEquals(notifications_response.data['count'], 1)

        self.client.force_login(user=self.users[2])
        notifications_response = self.client.get(path=reverse('user-viewset-notifications'))
        self.assertEquals(notifications_response.data['count'], 1)

        self.client.force_login(user=self.users[3])
        notifications_response = self.client.get(path=reverse('user-viewset-notifications'))
        self.assertEquals(notifications_response.data['count'], 1)

    def test_notification_edit_suggestion_publish(self):
        # user 2 creates an edit suggestion
        # user 1 (staff) publishes an edit suggestion
        # resource subscribers receives 1 notification
        # edit owner receives 1 notification
        publish_user = self.users[1]
        publish_user.is_staff = True
        publish_user.save()

        edit_author = self.users[2]

        category_subscribers, created = self.category.subscribers.get_or_create()
        resource_subscribers, created = self.resource.subscribers.get_or_create()
        category_subscribers.users += [publish_user.pk, edit_author.pk, self.users[3].pk]
        resource_subscribers.users += [publish_user.pk, edit_author.pk]
        category_subscribers.save()
        resource_subscribers.save()

        edit_suggestion = self.resource.edit_suggestions.new(data={
            "name": self.resource.name + ' edited',
            "description": self.resource.description,
            "category": self.category, "experience_level": 0,
            "description_long": self.resource.description_long,
            'edit_suggestion_reason': 'testing',
            'edit_suggestion_author': edit_author
        })
        self.client.force_login(user=publish_user)
        publish_response = self.client.post(
            path=reverse('concept-category-viewset-edit-suggestion-publish', kwargs={'pk': self.resource.pk}),
            data={'edit_suggestion_id': edit_suggestion.pk}
        )
        self.assertEquals(publish_response.status_code, 200)

        # actor should receive no notification
        notifications_response = self.client.get(path=reverse('user-viewset-notifications'))
        self.assertEquals(notifications_response.data['count'], 0)

        # resource author should receive notification
        self.client.force_login(user=self.resource.author)
        notifications_response = self.client.get(path=reverse('user-viewset-notifications'))
        self.assertEquals(notifications_response.data['count'], 1)

        self.client.force_login(user=edit_author)
        notifications_response = self.client.get(path=reverse('user-viewset-notifications'))
        self.assertEquals(notifications_response.data['count'], 1)

        self.client.force_login(user=self.users[3])
        notifications_response = self.client.get(path=reverse('user-viewset-notifications'))
        self.assertEquals(notifications_response.data['count'], 1)


    def test_notification_edit_suggestion_reject(self):
        # user 2 creates an edit suggestion
        # user 1 (staff) rejects an edit suggestion
        # resource subscribers receives 1 notification
        # edit owner receives 1 notification
        publish_user = self.users[1]
        publish_user.is_staff = True
        publish_user.save()

        edit_author = self.users[2]

        category_subscribers, created = self.category.subscribers.get_or_create()
        resource_subscribers, created = self.resource.subscribers.get_or_create()
        category_subscribers.users += [publish_user.pk, edit_author.pk, self.users[3].pk]
        resource_subscribers.users += [publish_user.pk, edit_author.pk]
        category_subscribers.save()
        resource_subscribers.save()

        edit_suggestion = self.resource.edit_suggestions.new(data={
            "name": self.resource.name + ' edited',
            "description": self.resource.description,
            "category": self.category, "experience_level": 0,
            "description_long": self.resource.description_long,
            'edit_suggestion_reason': 'testing',
            'edit_suggestion_author': edit_author
        })
        self.client.force_login(user=publish_user)
        publish_response = self.client.post(
            path=reverse('concept-category-viewset-edit-suggestion-reject', kwargs={'pk': self.resource.pk}),
            data={'edit_suggestion_id': edit_suggestion.pk}
        )
        self.assertEquals(publish_response.status_code, 200)

        # actor should receive no notification
        notifications_response = self.client.get(path=reverse('user-viewset-notifications'))
        self.assertEquals(notifications_response.data['count'], 0)

        # resource author should receive notification
        self.client.force_login(user=self.resource.author)
        notifications_response = self.client.get(path=reverse('user-viewset-notifications'))
        self.assertEquals(notifications_response.data['count'], 1)

        self.client.force_login(user=edit_author)
        notifications_response = self.client.get(path=reverse('user-viewset-notifications'))
        self.assertEquals(notifications_response.data['count'], 1)

        self.client.force_login(user=self.users[3])
        notifications_response = self.client.get(path=reverse('user-viewset-notifications'))
        self.assertEquals(notifications_response.data['count'], 1)

    def test_notification_edit_suggestion_delete(self):
        # user 2 creates an edit suggestion
        # user 1 (staff) deletes an edit suggestion
        # resource subscribers receives 1 notification
        # edit owner receives 1 notification
        publish_user = self.users[1]
        publish_user.is_staff = True
        publish_user.save()

        edit_author = self.users[2]

        category_subscribers, created = self.category.subscribers.get_or_create()
        resource_subscribers, created = self.resource.subscribers.get_or_create()
        category_subscribers.users += [publish_user.pk, edit_author.pk, self.users[3].pk]
        resource_subscribers.users += [publish_user.pk, edit_author.pk]
        category_subscribers.save()
        resource_subscribers.save()

        edit_suggestion = self.resource.edit_suggestions.new(data={
            "name": self.resource.name + ' edited',
            "description": self.resource.description,
            "category": self.category, "experience_level": 0,
            "description_long": self.resource.description_long,
            'edit_suggestion_reason': 'testing',
            'edit_suggestion_author': edit_author
        })
        self.client.force_login(user=publish_user)
        publish_response = self.client.delete(
            path=reverse('category-edit-suggestions-detail', kwargs={'pk': edit_suggestion.pk})
        )
        self.assertEquals(publish_response.status_code, 204)

        # actor should receive no notification
        notifications_response = self.client.get(path=reverse('user-viewset-notifications'))
        self.assertEquals(notifications_response.data['count'], 0)

        # resource author should receive notification
        self.client.force_login(user=self.resource.author)
        notifications_response = self.client.get(path=reverse('user-viewset-notifications'))
        self.assertEquals(notifications_response.data['count'], 1)

        self.client.force_login(user=edit_author)
        notifications_response = self.client.get(path=reverse('user-viewset-notifications'))
        self.assertEquals(notifications_response.data['count'], 1)

        self.client.force_login(user=self.users[3])
        notifications_response = self.client.get(path=reverse('user-viewset-notifications'))
        self.assertEquals(notifications_response.data['count'], 1)


from study_resource.models import StudyResourceIntermediary
STUDY_RESOURCE_VIEWSET_URL = reverse('study-resource-viewset-list')


class SubscriptionsNotificationsStudyResource(APITestCase):

    def setUp(self) -> None:
        create_bulk_users(5)
        create_categories()
        create_technologies()
        self.users = CustomUser.objects.order_by('pk').all()
        self.categories = Category.objects.order_by('pk').all()

    def test_resource_create(self):
        import datetime
        # author creates a resource with category, categ concept, tech concept
        # subscribers to category, technology, categ concept and tech concept should receive each 1 notification
        technologies = Technology.objects.filter(name__in=['python', 'django']).all()
        author = self.users[0]
        category_concept = create_category_concept(name='category concept', category=self.categories[1], author=author)
        technology_concept = create_technology_concept(name="tech concept", technology=technologies[0], author=author)

        # set up subscribers
        category_subscriber = self.users[1]
        self.categories[0].subscribe(category_subscriber)
        tech_1_subscriber = self.users[2]
        technologies[0].subscribe(tech_1_subscriber)
        tech_2_subscriber = self.users[3]
        technologies[1].subscribe(tech_2_subscriber)
        categ_concept_subscriber = self.users[4]
        category_concept.subscribe(categ_concept_subscriber)
        tech_concept_subscriber = self.users[5]
        technology_concept.subscribe(tech_concept_subscriber)

        # user creates a resource
        # we have to create an intermediary first
        resource_url = fake.url()
        StudyResourceIntermediary.objects.create(
            url=resource_url,
            status=0,
            author=author,
            active=datetime.datetime.now()
        )
        self.client.force_login(user=author)
        response_res = self.client.post(
            path=STUDY_RESOURCE_VIEWSET_URL,
            data={
                'name': 'learning resource',
                'image_file': get_dummy_image(),
                'summary': fake.text(150),
                'publication_date': '2020-09-20',
                'published_by': 'google',
                'url': resource_url,
                'category_concepts': '{}',
                'technology_concepts': '{}',
                'price': 0,
                'media': 0,
                'experience': 0,
                'category': self.categories[0].pk,
                'tags': json.dumps(['python', 'django']),
                'technologies': json.dumps([
                    {
                        'technology_id': technologies[0].pk,
                        'version': '123',
                    },
                    {
                        'technology_id': technologies[1].pk,
                        'version': 0,
                    },
                ])
            }
        )
        # the request is fucked, don't fkin know what is wrong. fuuuuuck!
        self.assertEqual(response_res.status_code, 201)
        # check users notifications
        check_user_has_notification(user=category_subscriber, test_instance=self, count=1)
        check_user_has_notification(user=tech_1_subscriber, test_instance=self, count=1)
        check_user_has_notification(user=tech_2_subscriber, test_instance=self, count=1)
        check_user_has_notification(user=categ_concept_subscriber, test_instance=self, count=1)
        check_user_has_notification(user=tech_concept_subscriber, test_instance=self, count=1)

    def test_notification_review(self):
        # user creates review
        # resource subscribers receives 1 notification
        pass
