from django.test import TestCase
from users.fake import create_user
from study_resource.fake import initial_data, new_study_resource, new_study_resource_review
from .models import Review
from django.core.exceptions import ValidationError
from users.models import CustomUser

# Create your tests here.

class StudyResourceTestCase(TestCase):

    def setUp(self):
        CustomUser.objects.bulk_create([create_user() for _ in range(0, 5)])
        self.users = CustomUser.objects.all()
        initial_data()

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
