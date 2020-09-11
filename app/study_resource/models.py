from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.postgres.fields import ArrayField
from django.db.models.fields import SlugField
from django.template.defaultfilters import slugify
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank, TrigramSimilarity
from users.models import CustomUser
from simple_history.models import HistoricalRecords
from django.urls import reverse
import tsvector_field


class TagModelManager(models.Manager):

    def validate_tags(self, tags_to_validate):
        # check if text tags already exist. if not, create them
        create_tags = set()
        validated_tags = set()
        for tag in tags_to_validate:
            if type(tag) == int:
                validated_tags.add(tag)
            else:
                create_tags.add(tag.lower())
        if len(create_tags) > 0:
            existing_tags = self.filter(name__in=create_tags)
            for ex_tag in existing_tags:
                validated_tags.add(ex_tag.id)
                create_tags.remove(ex_tag.name)
        for new_tag in create_tags:
            created_tag = self.create(name=new_tag)
            validated_tags.add(created_tag.id)
        return validated_tags


class Tag(models.Model):
    name = models.CharField(max_length=128, db_index=True)
    search_vector_index = tsvector_field.SearchVectorField([
        tsvector_field.WeightedColumn('name', 'A'),
    ], 'english')
    objects = TagModelManager()

    def __str__(self):
        return self.name


class Technology(models.Model):
    name = models.CharField(max_length=128, db_index=True)
    description = models.TextField(max_length=1024)
    version = models.CharField(max_length=128)
    url = models.TextField(max_length=1024)
    search_vector_index = tsvector_field.SearchVectorField([
        tsvector_field.WeightedColumn('name', 'A'),
        tsvector_field.WeightedColumn('description', 'B'),
    ], 'english')

    def __str__(self):
        return f'{self.name} {self.version}'

    class Meta:
        unique_together = ['name', 'version']


class StudyResourceManager(models.Manager):

    def get_queryset(self):
        return StudyResourceQueryset(self.model, using=self.db).annotate_with_rating()

    def order_by_rating_then_publishing_date(self):
        return StudyResourceQueryset(self.model, using=self.db).annotate_with_rating().order_by(
            models.F('rating').desc(nulls_last=True),
            '-reviews_count',
            'publication_date'
        )


class StudyResourceQueryset(models.QuerySet):

    def annotate_with_rating(self):
        return self.annotate(rating=models.Avg('reviews__rating')).annotate(
            reviews_count=models.Count('reviews', distinct=True))

    def order_by_rating_then_publishing_date(self):
        return self.annotate_with_rating().order_by(
            models.F('rating').desc(nulls_last=True),
            '-reviews_count',
            'publication_date'
        )

    def search_match(self, text, min_rank=0.1):
        # searching through tags and techs is too expensive
        # search_vector = SearchVector('search_vector_index', 'tags__search_vector_index', 'technologies__search_vector_index')
        search_vector = SearchVector('search_vector_index')
        rank = SearchRank(search_vector, SearchQuery(text))
        return self.annotate(
            rank=rank,
        ) \
            .filter(models.Q(rank__gte=min_rank)) \
            .order_by('-rank')

    def search_similar(self, text, min_sim=0.1):
        return self.annotate(
            similarity=TrigramSimilarity('name', text) + TrigramSimilarity('summary', text)
        ) \
            .filter(models.Q(similarity__gte=min_sim))\
            .order_by('-similarity')


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
    slug = SlugField(max_length=255)
    # related fields
    author = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    tags = models.ManyToManyField(Tag, related_name='resources')
    technologies = models.ManyToManyField(Technology, related_name='resources')
    # history fields
    history = HistoricalRecords(excluded_fields='search_vector_index')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # choices fields
    price = models.IntegerField(default=0, choices=Price.choices, db_index=True)
    media = models.IntegerField(default=0, choices=Media.choices, db_index=True)
    experience_level = models.IntegerField(default=0, choices=ExperienceLevel.choices, db_index=True)
    search_vector_index = tsvector_field.SearchVectorField([
        tsvector_field.WeightedColumn('name', 'A'),
        tsvector_field.WeightedColumn('summary', 'B'),
    ], 'english')

    def __str__(self):
        return f'{self.media_label} on {self.name}'

    @property
    def absolute_url(self):
        return reverse('detail', kwargs={'id': self.id, 'slug': self.slug})

    def save(self, *args, **kwargs):  # new
        if not self.slug:
            self.slug = slugify(self.name)
        return super().save(*args, **kwargs)

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

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        super(Review, self).save()

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
