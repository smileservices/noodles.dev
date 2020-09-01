from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.postgres.fields import ArrayField
from users.models import CustomUser
from simple_history.models import HistoricalRecords
from django.urls import reverse

class Tag(models.Model):
    name = models.CharField(max_length=128, db_index=True)

    def __str__(self):
        return self.name


class Technology(models.Model):
    name = models.CharField(max_length=128, db_index=True)
    description = models.TextField(max_length=1024)
    version = models.CharField(max_length=128)
    url = models.TextField(max_length=1024)

    def __str__(self):
        return f'{self.name} v{self.version}'

    class Meta:
        unique_together = ['name', 'version']


class StudyResourceManager(models.Manager):
    def get_queryset(self):
        # it's not so inneficient
        return StudyResourceQueryset(self.model, using=self.db).annotate_with_rating()


class StudyResourceQueryset(models.QuerySet):
    def annotate_with_rating(self):
        return self.annotate(rating=models.Avg('reviews__rating'), reviews_count=models.Count('reviews'))


class StudyResource(models.Model):
    class Price(models.IntegerChoices):
        FREE = (0, 'free')
        PAID = (1, 'paid')

    class Media(models.IntegerChoices):
        ARTICLE = (0, 'article')
        VIDEO = (1, 'video')
        SERIES = (3, 'series')
        COURSE = (4, 'course')
        BOOK = (5, 'book')

    class ExperienceLevel(models.IntegerChoices):
        ABEGINNER = (0, 'absolute beginner')
        JUNIOR = (1, 'junior')
        MIDDLE = (2, 'middle')
        SENIOR = (3, 'experienced')

    objects = StudyResourceManager()
    name = models.CharField(max_length=128)
    publication_date = models.DateField()
    published_by = models.CharField(max_length=128)
    url = models.TextField(max_length=1024, unique=True)
    summary = models.TextField(max_length=2048)
    # related fields
    author = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    tags = models.ManyToManyField(Tag, related_name='resources')
    technologies = models.ManyToManyField(Technology, related_name='resources')
    # history fields
    history = HistoricalRecords()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # choices fields
    price = models.IntegerField(default=0, choices=Price.choices, db_index=True)
    media = models.IntegerField(default=0, choices=Media.choices, db_index=True)
    experience_level = models.IntegerField(default=0, choices=ExperienceLevel.choices, db_index=True)

    def __str__(self):
        return f'{self.media_label} on {self.name}'

    @property
    def price_label(self):
        return self.Price(self.price).label

    @property
    def media_label(self):
        return self.Media(self.media).label

    @property
    def experience_level_label(self):
        return self.ExperienceLevel(self.experience_level).label


class Review(models.Model):
    study_resource = models.ForeignKey(StudyResource, on_delete=models.CASCADE, related_name='reviews')
    author = models.ForeignKey(CustomUser, blank=True, null=True, on_delete=models.SET_NULL)
    rating = models.IntegerField()
    text = models.TextField(max_length=2048)
    visible = models.BooleanField(default=True)
    thumbs_up_array = ArrayField(models.IntegerField(), default=list)
    thumbs_down_array = ArrayField(models.IntegerField(), default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['author', 'study_resource']

    class ErrorMessages:
        ONE_USER_ONE_VOTE = 'An user can vote only once'
        USER_DIDNT_VOTE = "User didn't vote"
        USER_VOTE_OWN_REVIEW = 'Same user not allowed to vote on own review'

    def __str__(self):
        return f'review for {self.study_resource}: {self.rating} by {self.author}'

    @property
    def thumbs_up(self):
        return len(self.thumbs_up_array)

    @property
    def thumbs_down(self):
        return len(self.thumbs_down_array)

    def _validate_vote(self, user: CustomUser, vote: str):
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


class CollectionQueryset(models.QuerySet):
    def annotate_with_items_count(self):
        return self.annotate(items_count=models.Count('resources'))


class CollectionManager(models.Manager):
    def get_queryset(self):
        return CollectionQueryset(self.model, using=self.db).annotate_with_items_count()


class Collection(models.Model):
    objects = CollectionManager()
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=128)
    owner = models.ForeignKey(CustomUser, null=True, blank=True, on_delete=models.SET_NULL)
    description = models.TextField(null=True, blank=True)
    resources = models.ManyToManyField(
        StudyResource,
        related_name="collections",
        through='CollectionResources'
    )
    tags = models.ManyToManyField(Tag, related_name='collections')
    technologies = models.ManyToManyField(Technology, related_name='collections')

    def __str__(self):
        return f'{self.name} by {self.owner}'


class CollectionResources(models.Model):
    study_resource = models.ForeignKey(StudyResource, on_delete=models.CASCADE)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    order = models.IntegerField(null=True, blank=True)
