from rest_framework.test import APITestCase
from .models import Collection
from random import choices, randint
from django.urls import reverse_lazy
from users.fake import create_user, create_user_single
from study_resource.fake import new_study_resource
from tag.fake import create_tags
from technology.fake import create_technologies
from category.fake import create_categories
from users.models import CustomUser


class CollectionsTestCase(APITestCase):

    def setUp(self):
        CustomUser.objects.bulk_create([create_user() for _ in range(0, 5)])
        self.users = CustomUser.objects.all()
        create_categories()
        self.tags = create_tags()
        self.technologies = create_technologies()

    def test_create_collection(self):
        user = create_user_single()
        # for 1st collection
        resource_1 = new_study_resource(user)
        resource_1.save()
        resource_2 = new_study_resource(user)
        resource_2.save()
        resource_3 = new_study_resource(user)
        resource_3.save()
        # for 2nd collection
        resource_4 = new_study_resource(user)
        resource_4.save()
        resource_5 = new_study_resource(user)
        resource_5.save()
        resource_6 = new_study_resource(user)
        resource_6.save()
        # create collection
        self.client.force_login(user=user)
        collection_create_response = self.client.post(
            reverse_lazy('collection-viewset-list'),
            {
                'name': '1st collection',
                'description': 'some description',
                'tags': choices([t.pk for t in self.tags], k=randint(1, 5)),
                'technologies': choices([t.pk for t in self.technologies.values()], k=randint(1, 5))
            },
            format='json'
        )
        self.assertEqual(collection_create_response.status_code, 201)
        collection_pk = collection_create_response.data['pk']
        # add resources to collection
        for r in [resource_1, resource_2, resource_3]:
            add_to_collection_response = self.client.post(
                reverse_lazy('collection-viewset-set-resource-to-collections') + f'?pk={r.pk}',
                {'collections': [collection_pk, ]},
                format='json'
            )
            self.assertEqual(add_to_collection_response.status_code, 200)

        # create control collection2
        collection_2 = Collection.objects.create(name='2nd collection', description='something', author=user)
        collection_2.resources.through.objects.create(collection=collection_2, study_resource=resource_4, order=0)
        collection_2.resources.through.objects.create(collection=collection_2, study_resource=resource_5, order=1)
        collection_2.resources.through.objects.create(collection=collection_2, study_resource=resource_6, order=2)

        # order should be 0 - resource1, 1 - resource2, 2 - resource3
        # check collection resources
        collection_items_response = self.client.get(
            reverse_lazy('collection-viewset-resources', kwargs={'pk': collection_pk})
        )
        self.assertEqual(collection_items_response.status_code, 200)
        # check resources have order None
        self.assertEqual([c['order'] for c in collection_items_response.data], [None, None, None])
        # check update resources
        update_items_response = self.client.post(
            reverse_lazy('collection-viewset-update-collection-items'),
            {
                'pk': collection_pk,
                'resources': [{'pk': resource_1.pk, 'order': 0}, {'pk': resource_2.pk, 'order': 1}, {'pk': resource_3.pk, 'order': 2}]
            },
            format='json'
        )
        self.assertEqual(update_items_response.status_code, 204)
        updated_collection_items_response = self.client.get(
            reverse_lazy('collection-viewset-resources', kwargs={'pk': collection_pk})
        )
        self.assertEqual([c['order'] for c in updated_collection_items_response.data], [0, 1, 2])
