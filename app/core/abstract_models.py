from django.db import models
from django.template.defaultfilters import slugify
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank, TrigramSimilarity
from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError


class DateTimeModelMixin(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class RequireAdminAprovalModelMixin(models.Model):
    approved = models.BooleanField(default=False)

    class Meta:
        abstract = True


class SluggableModelMixin(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):  # new
        if not self.slug:
            self.slug = slugify(self.name)
        return super().save(*args, **kwargs)


class SearchAbleQuerysetMixin(models.QuerySet):

    def search_match(self, text, min_rank=0.1):
        # searching through tags and techs is too expensive
        search_vector = SearchVector('search_vector_index')
        rank = SearchRank(search_vector, SearchQuery(text))
        return self.annotate(
            rank=rank,
        ) \
            .filter(models.Q(rank__gte=min_rank)) \
            .order_by('-rank')

    def search_similar(self, fields, text, min_sim=0.1):
        similarity = sum([TrigramSimilarity(field, text) for field in fields])
        return self.annotate(
            similarity=similarity
        ) \
            .filter(models.Q(similarity__gte=min_sim)) \
            .order_by('-similarity')


class VotableMixin(models.Model):
    thumbs_up_array = ArrayField(models.IntegerField(), default=list)
    thumbs_down_array = ArrayField(models.IntegerField(), default=list)

    class ErrorMessages:
        ONE_USER_ONE_VOTE = 'An user can vote only once'
        USER_DIDNT_VOTE = "User didn't vote"
        USER_VOTE_OWN_REVIEW = 'Same user not allowed to vote on own review'

    class Meta:
        abstract = True

    @property
    def thumbs_up(self):
        return len(self.thumbs_up_array)

    @property
    def thumbs_down(self):
        return len(self.thumbs_down_array)

    def _validate_vote(self, user, vote: str):
        if user == self.author:
            raise ValidationError(self.ErrorMessages.USER_VOTE_OWN_REVIEW)
        if user.pk in self.thumbs_up_array:
            self.cancel_vote(user)
            if vote == 'up':
                return 'cancel'
        if user.pk in self.thumbs_down_array:
            self.cancel_vote(user)
            if vote == 'down':
                return 'cancel'

    def cancel_vote(self, user):
        if user.pk in self.thumbs_up_array:
            self.thumbs_up_array.remove(user.pk)
            user.cancel_thumb_up()
            self.author.positive_score -= 1
        elif user.pk in self.thumbs_down_array:
            self.thumbs_down_array.remove(user.pk)
            user.cancel_thumb_down()
            self.author.negative_score -= 1
        else:
            raise ValidationError(self.ErrorMessages.USER_DIDNT_VOTE)

    def vote_up(self, user):
        if self._validate_vote(user, 'up') != 'cancel':
            self.thumbs_up_array.append(user.pk)
            self.author.positive_feedback()
            user.thumb_up()
        self.save()

    def vote_down(self, user):
        if self._validate_vote(user, 'down') != 'cancel':
            self.thumbs_down_array.append(user.pk)
            self.author.negative_feedback()
            user.thumb_down()
        self.save()
