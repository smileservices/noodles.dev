from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError

from users.models import CustomUser

MODEL_AUTHOR_NAMES = ['edit_suggestion_author', 'author', ]


class VotableMixin(models.Model):
    thumbs_up_array = ArrayField(models.IntegerField(), default=list)
    thumbs_down_array = ArrayField(models.IntegerField(), default=list)

    class ErrorMessages:
        ONE_USER_ONE_VOTE = 'An user can vote only once'
        USER_DIDNT_VOTE = "User didn't vote"
        USER_VOTE_OWN_REVIEW = 'Same user not allowed to vote on own resource'

    class Meta:
        abstract = True

    def _get_author(self):
        for author_field_name in MODEL_AUTHOR_NAMES:
            if hasattr(self, author_field_name):
                return getattr(self, author_field_name)
        raise AttributeError('Cannot find model author field')

    @property
    def thumbs_up(self):
        return len(self.thumbs_up_array)

    @property
    def thumbs_down(self):
        return len(self.thumbs_down_array)

    def _validate_vote(self, user: CustomUser, vote: str):
        if user == self._get_author():
            raise ValidationError(self.ErrorMessages.USER_VOTE_OWN_REVIEW)
        if user.pk in self.thumbs_up_array:
            self.cancel_vote(user)
            if vote == 'up':
                return 'cancel'
        if user.pk in self.thumbs_down_array:
            self.cancel_vote(user)
            if vote == 'down':
                return 'cancel'

    def cancel_vote(self, user: CustomUser):
        author = self._get_author()
        if user.pk in self.thumbs_up_array:
            self.thumbs_up_array.remove(user.pk)
            user.cancel_thumb_up()
            author.positive_score -= 1
        elif user.pk in self.thumbs_down_array:
            self.thumbs_down_array.remove(user.pk)
            user.cancel_thumb_down()
            author.negative_score -= 1
        else:
            raise ValidationError(self.ErrorMessages.USER_DIDNT_VOTE)

    def vote_up(self, user: CustomUser):
        author = self._get_author()
        if self._validate_vote(user, 'up') != 'cancel':
            self.thumbs_up_array.append(user.pk)
            author.positive_feedback()
            user.thumb_up()
        self.save()

    def vote_down(self, user: CustomUser):
        author = self._get_author()
        if self._validate_vote(user, 'down') != 'cancel':
            self.thumbs_down_array.append(user.pk)
            author.negative_feedback()
            user.thumb_down()
        self.save()
