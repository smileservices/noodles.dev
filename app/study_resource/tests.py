from django.test import TestCase
from rest_framework.test import APITestCase
from users.fake import create_user, create_user_single
from study_resource.fake import new_study_resource, new_study_resource_review
from .models import Review
from django.core.exceptions import ValidationError
from users.models import CustomUser
from tag.fake import create_tags
from technology.fake import create_technologies
from category.fake import create_categories
from .models import Collection, CollectionResources
from technology.models import Technology
from random import choice, choices, randint
from django.urls import reverse_lazy

# Create your tests here.

class StudyResourceTestCase(TestCase):

    def setUp(self):
        CustomUser.objects.bulk_create([create_user() for _ in range(0, 5)])
        self.users = CustomUser.objects.all()
        create_categories()
        create_tags()
        create_technologies()

    def create_review(self, resource_author, review_author):
        resource = new_study_resource(resource_author)
        resource.save()
        review = new_study_resource_review(resource, review_author)
        review.save()
        self.assertIn(review, resource.reviews.all())
        return resource, review

    def test_review_vote_validation_author(self):
        '''
            the review author can't vote on its own
            an user can vote only once
            an user can cancel vote only if it voted
            a + vote will bring one point to user positive score
            a - vote will bring one point to user negative score
        '''
        resource_author, review_author = self.users[0], self.users[1]
        resource, review = self.create_review(resource_author, review_author)
        self.assertRaisesMessage(ValidationError, Review.ErrorMessages.USER_VOTE_OWN_REVIEW,
                                 review.vote_up,
                                 review_author
                                 )

    def test_review_vote_up(self):
        resource_author, review_author = self.users[0], self.users[1]
        resource, review = self.create_review(resource_author, review_author)
        other_user = self.users[2]

        review.vote_up(other_user)
        self.assertEqual(review.thumbs_up, 1)
        self.assertEqual(review.author.positive_score, 1)
        self.assertEqual(other_user.positive_thumbs, 1)

    def test_review_vote_down(self):
        resource_author, review_author = self.users[0], self.users[1]
        resource, review = self.create_review(resource_author, review_author)
        other_user = self.users[2]

        review.vote_down(other_user)
        self.assertEqual(review.thumbs_down, 1)
        self.assertEqual(review.author.negative_score, 1)
        self.assertEqual(other_user.negative_thumbs, 1)

    def test_review_vote_already_voted_up(self):
        '''
            Voting on review already voted should:
            1. vote again on same option: cancel vote
            2. vote again on different option: move vote to new chosen option
        '''
        resource_author, review_author = self.users[0], self.users[1]
        resource, review = self.create_review(resource_author, review_author)
        other_user = self.users[2]

        review.vote_up(other_user)
        review.vote_up(other_user)
        self.assertEqual(review.thumbs_up, 0)
        self.assertEqual(review.author.positive_score, 0)
        self.assertEqual(other_user.positive_thumbs, 0)

    def test_review_vote_already_voted_down(self):
        '''
            Voting on review already voted should:
            1. vote again on same option: cancel vote
            2. vote again on different option: move vote to new chosen option
        '''
        resource_author, review_author = self.users[0], self.users[1]
        resource, review = self.create_review(resource_author, review_author)
        other_user = self.users[2]

        review.vote_down(other_user)
        review.vote_down(other_user)
        self.assertEqual(review.thumbs_down, 0)
        self.assertEqual(review.author.negative_score, 0)
        self.assertEqual(other_user.negative_thumbs, 0)

    def test_review_vote_already_voted_switch_vote(self):
        '''
            Voting on review already voted should:
            1. vote again on same option: cancel vote
            2. vote again on different option: move vote to new chosen option
        '''
        resource_author, review_author = self.users[0], self.users[1]
        resource, review = self.create_review(resource_author, review_author)
        other_user = self.users[2]

        review.vote_down(other_user)
        review.vote_up(other_user)
        self.assertEqual(review.thumbs_down, 0)
        self.assertEqual(review.author.negative_score, 0)
        self.assertEqual(other_user.negative_thumbs, 0)
        self.assertEqual(review.thumbs_up, 1)
        self.assertEqual(review.author.positive_score, 1)
        self.assertEqual(other_user.positive_thumbs, 1)
        review.vote_down(other_user)
        self.assertEqual(review.thumbs_down, 1)
        self.assertEqual(review.author.negative_score, 1)
        self.assertEqual(other_user.negative_thumbs, 1)
        self.assertEqual(review.thumbs_up, 0)
        self.assertEqual(review.author.positive_score, 0)
        self.assertEqual(other_user.positive_thumbs, 0)


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
                'tags': choices([t.pk for t in self.tags], k=randint(1,5)),
                'technologies':  choices([t.pk for t in self.technologies.values()], k=randint(1,5))
            },
            format='json'
        )
        self.assertEqual(collection_create_response.status_code, 201)
        collection_pk = collection_create_response.data['pk']
        # add resources to collection
        for r in [resource_1, resource_2, resource_3]:
            add_to_collection_response = self.client.post(
                reverse_lazy('collection-viewset-set-resource-to-collections')+f'?pk={r.pk}',
                {'collections': [collection_pk, ]},
                format='json'
            )
            self.assertEqual(add_to_collection_response.status_code, 200)

        # create control collection2
        collection_2 = Collection.objects.create(name='2nd collection', description='something')
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
        self.assertEqual([c['order'] for c in collection_items_response.data['results']], [None, None, None])
        # check update resources
        update_items_response = self.client.post(
            reverse_lazy('collection-viewset-update-collection-items'),
            {
                'pk': collection_pk,
                'resources': [{'pk': 1, 'order': 0},{'pk': 2, 'order': 1},{'pk': 3, 'order': 2}]
             },
            format='json'
        )
        self.assertEqual(update_items_response.status_code, 204)
        updated_collection_items_response = self.client.get(
            reverse_lazy('collection-viewset-resources', kwargs={'pk': collection_pk})
        )
        self.assertEqual([c['order'] for c in updated_collection_items_response.data['results']], [0, 1, 2])
