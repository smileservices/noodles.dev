from django.db import models
from django.contrib.postgres.indexes import GinIndex
from django.urls import reverse
from django.dispatch import receiver
from django.core.files import File
from uuid import uuid4
from tempfile import NamedTemporaryFile
import tsvector_field
from versatileimagefield.fields import VersatileImageField
from simple_history.models import HistoricalRecords
from users.models import CustomUser
import requests
from versatileimagefield.image_warmer import VersatileImageFieldWarmer
from versatileimagefield.utils import build_versatileimagefield_url_set
from django.conf import settings
from tag.models import Tag
from technology.models import Technology
from core.abstract_models import SearchAbleQuerysetMixin, DateTimeModelMixin, SluggableModelMixin, VotableMixin


class StudyResourceManager(models.Manager):

    def get_queryset(self):
        return StudyResourceQueryset(self.model, using=self.db).annotate_with_rating()

    def order_by_rating_then_publishing_date(self):
        return StudyResourceQueryset(self.model, using=self.db).annotate_with_rating().order_by(
            models.F('rating').desc(nulls_last=True),
            '-reviews_count',
            'publication_date'
        )


class StudyResourceQueryset(SearchAbleQuerysetMixin):

    def annotate_with_rating(self):
        return self.annotate(rating=models.Avg('reviews__rating')).annotate(
            reviews_count=models.Count('reviews', distinct=True))

    def order_by_rating_then_publishing_date(self):
        return self.annotate_with_rating().order_by(
            models.F('rating').desc(nulls_last=True),
            '-reviews_count',
            'publication_date'
        )


class StudyResource(SluggableModelMixin, DateTimeModelMixin, VotableMixin):
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
    publication_date = models.DateField()
    published_by = models.CharField(max_length=256)
    url = models.TextField(max_length=1024, unique=True)
    summary = models.TextField(max_length=2048)
    # related fields
    author = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    tags = models.ManyToManyField(Tag, related_name='resources')
    technologies = models.ManyToManyField(Technology, related_name='resources')
    # history fields
    history = HistoricalRecords(excluded_fields=['search_vector_index'])
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

    class Meta:
        indexes = [
            GinIndex(fields=['name', 'summary'], name='gintrgm_index', opclasses=['gin_trgm_ops', 'gin_trgm_ops'])
        ]

    def __str__(self):
        return f'{self.media_label} on {self.name}'

    @property
    def absolute_url(self):
        return reverse('detail', kwargs={'id': self.id, 'slug': self.slug})

    @property
    def image(self):
        return self.images.first()

    @property
    def price_label(self):
        return self.Price(self.price).label

    @property
    def media_label(self):
        return self.Media(self.media).label

    @property
    def experience_level_label(self):
        return self.ExperienceLevel(self.experience_level).label


class StudyResourceImage(models.Model):
    study_resource = models.ForeignKey(StudyResource, on_delete=models.CASCADE, related_name='images')
    image_file = VersatileImageField(upload_to='tutorials', blank=True, null=True)
    image_url = models.URLField(default='', blank=True, null=True)

    @property
    def sizes(self):
        return build_versatileimagefield_url_set(
            self.image_file,
            settings.VERSATILEIMAGEFIELD_RENDITION_KEY_SETS['resource_image']
        )

    def save(self, *args, **kwargs):
        if self.image_url and not self.image_file:
            img_temp = NamedTemporaryFile(delete=True)
            img_temp.write(requests.get(self.image_url).content)
            self.image_file.save(
                f"image_{self.study_resource.pk}_{uuid4().__str__()}.{self.image_url.split('.')[-1]}",
                File(img_temp)
            )
            img_temp.flush()
        else:
            super(StudyResourceImage, self).save(*args, **kwargs)


@receiver(models.signals.post_delete, sender=StudyResourceImage)
def delete_study_resource_images(sender, instance, **kwargs):
    """
    Deletes StudyResourceImage image renditions on post_delete.
    """
    instance.image_file.delete_all_created_images()
    instance.image_file.delete(save=False)


@receiver(models.signals.post_save, sender=StudyResourceImage)
def warm_Study_Resource_Images(sender, instance, **kwargs):
    """Ensures Person head shots are created post-save"""
    sr_images_warmer = VersatileImageFieldWarmer(
        instance_or_queryset=instance,
        rendition_key_set='resource_image',
        image_attr='image_file'
    )
    num_created, failed_to_create = sr_images_warmer.warm()


class Review(DateTimeModelMixin, VotableMixin):
    study_resource = models.ForeignKey(StudyResource, on_delete=models.CASCADE, related_name='reviews')
    author = models.ForeignKey(CustomUser, blank=True, null=True, on_delete=models.SET_NULL)
    rating = models.IntegerField()
    text = models.TextField(max_length=2048)
    visible = models.BooleanField(default=True)

    class Meta:
        unique_together = ['author', 'study_resource']

    def __str__(self):
        return f'review for {self.study_resource}: {self.rating} by {self.author}'

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):
        super(Review, self).save()


class CollectionQueryset(models.QuerySet):
    def annotate_with_items_count(self):
        return self.annotate(items_count=models.Count('resources'))


class CollectionManager(models.Manager):
    def get_queryset(self):
        return CollectionQueryset(self.model, using=self.db).annotate_with_items_count()


class Collection(DateTimeModelMixin, VotableMixin):
    objects = CollectionManager()
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
