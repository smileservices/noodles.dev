from django.db import models
from django.contrib.postgres.indexes import GinIndex
from django.urls import reverse
from django.dispatch import receiver
from django.core.files import File
from uuid import uuid4
from tempfile import NamedTemporaryFile
import tsvector_field
from versatileimagefield.fields import VersatileImageField
from users.models import CustomUser
import requests
from versatileimagefield.image_warmer import VersatileImageFieldWarmer
from versatileimagefield.utils import build_versatileimagefield_url_set
from django.conf import settings
from tag.models import Tag
from technology.models import Technology
from category.models import Category
from core.abstract_models import SearchAbleQuerysetMixin, DateTimeModelMixin, SluggableModelMixin
from votable.models import VotableMixin
from django_edit_suggestion.models import EditSuggestion
from core.edit_suggestions import edit_suggestion_change_status_condition, post_reject_edit, post_publish_edit
from core.abstract_models import ElasticSearchIndexableMixin
from core.tasks import sync_to_elastic
from core import utils


def delete_study_resource_primary_images(sender, instance, **kwargs):
    """
    Deletes Technology image renditions on post_delete.
    """
    instance.image_file.delete_all_created_images()
    instance.image_file.delete(save=False)


def warm_study_resource_primary_image(sender, instance, **kwargs):
    """Ensures Technologies logos are created post-save"""
    sr_images_warmer = VersatileImageFieldWarmer(
        instance_or_queryset=instance,
        rendition_key_set='resource_image',
        image_attr='image_file'
    )
    num_created, failed_to_create = sr_images_warmer.warm()


def remove_old_image(sender, instance, **kwargs):
    if kwargs['update_fields'] and 'image_file' in kwargs['update_fields']:
        db_instance = sender.objects.get(pk=instance.pk)
        if db_instance.image_file != instance.image_file:
            db_instance.image_file.delete_all_created_images()
            db_instance.image_file.delete(save=False)


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
        return self.annotate(
            rating=models.Avg('reviews__rating')
        ).annotate(
            reviews_count=models.Count('reviews', distinct=True)
        )

    def order_by_rating_then_publishing_date(self):
        return self.annotate_with_rating().order_by(
            models.F('rating').desc(nulls_last=True),
            '-reviews_count',
            'publication_date'
        )


class StudyResourceTechnology(models.Model):
    technology = models.ForeignKey(Technology, on_delete=models.CASCADE)
    study_resource = models.ForeignKey('StudyResource', on_delete=models.CASCADE)
    name = models.CharField(max_length=255)  # duplicate technology value for limiting queries
    slug = models.CharField(max_length=255)
    version = models.FloatField(max_length=128, blank=True, null=True)

    class Meta:
        unique_together = ['technology', 'study_resource']

    def __str__(self):
        return f"{self.name} {self.version}"

    def save(self, *args, **kwargs):
        self.name = self.technology.name
        self.slug = self.technology.slug
        return super().save(*args, **kwargs)

    @property
    def absolute_url(self):
        return reverse('tech-detail', kwargs={'id': self.technology_id, 'slug': self.slug})


class StudyResource(SluggableModelMixin, DateTimeModelMixin, VotableMixin, ElasticSearchIndexableMixin):
    class Price(models.IntegerChoices):
        FREE = (0, 'Free')
        PAID = (1, 'Paid')

    class Media(models.IntegerChoices):
        ARTICLE = (0, 'Article')
        VIDEO = (1, 'Video')
        SERIES = (3, 'Series')
        COURSE = (4, 'Course')
        BOOK = (5, 'Book')

    class ExperienceLevel(models.IntegerChoices):
        ABEGINNER = (0, 'Absolute Beginner')
        JUNIOR = (1, 'Junior')
        MIDDLE = (2, 'Middle')
        SENIOR = (3, 'Experienced')

    objects = StudyResourceManager()
    publication_date = models.DateField()
    published_by = models.CharField(max_length=256)
    url = models.TextField(max_length=1024)
    image_file = VersatileImageField(upload_to='tutorials', blank=True, null=True)
    summary = models.TextField(max_length=2048)
    # related fields
    author = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    tags = models.ManyToManyField(Tag, related_name='tags')
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.DO_NOTHING, related_name='resources')
    technologies = models.ManyToManyField(Technology, related_name='resources', through='StudyResourceTechnology')
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
    edit_suggestions = EditSuggestion(
        excluded_fields=(
            'created_at', 'updated_at', 'search_vector_index', 'author', 'thumbs_up_array', 'thumbs_down_array'),
        m2m_fields=[
            {'name': 'tags', 'model': Tag},
            {
                'name': 'technologies',
                'model': Technology,
                'through': {
                    'model': StudyResourceTechnology,
                    'self_field': 'study_resource',
                    'rel_field': 'technology'
                }
            },
        ],
        change_status_condition=edit_suggestion_change_status_condition,
        post_publish=post_publish_edit,
        post_reject=post_reject_edit,
        bases=(VotableMixin,),
        signals={
            'post_save': [warm_study_resource_primary_image, ],
            'post_delete': [delete_study_resource_primary_images, ]
        },
        attrs_to_be_copied=['image', ]
    )

    class Meta:
        indexes = [
            GinIndex(fields=['name', 'summary'], name='gintrgm_study_resource_index',
                     opclasses=['gin_trgm_ops', 'gin_trgm_ops'])
        ]

    def __str__(self):
        return f'{self.media_label} on {self.name}'

    @property
    def absolute_url(self):
        return reverse('study-resource-detail', kwargs={'id': self.id, 'slug': self.slug})

    @property
    def image(self):
        return build_versatileimagefield_url_set(
            self.image_file,
            settings.VERSATILEIMAGEFIELD_RENDITION_KEY_SETS['resource_image']
        )

    @property
    def price_label(self):
        return self.Price(self.price).label

    @property
    def media_label(self):
        return self.Media(self.media).label

    @property
    def experience_level_label(self):
        return self.ExperienceLevel(self.experience_level).label

    def get_technologies(self):
        return self.technologies.through.objects.filter(study_resource=self).all()

    @staticmethod
    def get_elastic_mapping() -> {}:
        return {
            "properties": {
                "pk": {"type": "integer"},

                # model fields
                "name": {
                    "type": "text",
                    "copy_to": "suggest",
                },
                "summary": {
                    "type": "text",
                    "copy_to": "suggest",
                },
                "publication_date": {"type": "date", "format": "yyyy-MM-dd"},
                "published_by": {"type": "text"},
                "url": {"type": "text"},
                "image": {"type": "nested"},
                "category": {"type": "keyword"},
                "tags": {"type": "keyword"},
                "technologies": {
                    "type": "nested",
                    "include_in_parent": True,
                    "properties": {
                        "name": {"type": "keyword"},
                        "version": {"type": "float"},
                        "url": {"type": "keyword"},
                    }
                },

                "author": {"type": "nested"},
                "price": {"type": "keyword"},
                "media": {"type": "keyword"},
                "experience_level": {"type": "keyword"},

                # compound
                "rating": {"type": "half_float"},
                "reviews_count": {"type": "integer"},
                "votes_up": {"type": "short"},
                "votes_down": {"type": "short"},
                "edit_suggestions_count": {"type": "integer"},

                "suggest": {
                    "type": "completion",
                }
            }
        }

    def get_elastic_data(self) -> (str, list):
        index_name = 'study_resources'
        instance_from_manager = StudyResource.objects.values('rating', 'reviews_count').get(pk=self.pk)
        rating = instance_from_manager['rating'] if instance_from_manager['rating'] else 0
        data = {
            "pk": self.pk,

            # model fields
            "name": self.name,
            "summary": self.summary,
            "publication_date": self.publication_date.isoformat(),
            "published_by": self.published_by,
            "url": self.absolute_url,
            "image": self.image if self.image_file else {},

            "category": self.category.name,
            "tags": [t.name for t in self.tags.all()],
            "technologies": [{"name": t.name, "version": t.version, "url": t.technology.absolute_url} for t in self.get_technologies()],

            "author": {
                "pk": self.author.pk,
                "username": self.author.username
            },
            "price": self.price_label,
            "media": self.media_label,
            "experience_level": self.experience_level_label,

            # compound
            "rating": rating,
            "reviews_count": instance_from_manager['reviews_count'],
            "votes_up": self.thumbs_up,
            "votes_down": self.thumbs_down,
            "edit_suggestions_count": self.edit_suggestions.filter(edit_suggestion_status=0).count(),
        }
        return index_name, data


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
            name = f"image_{self.study_resource.pk}_{uuid4().__str__()}.{self.image_url.split('.')[-1]}"
            content = requests.get(self.image_url).content
            utils.save_file_to_field(self.image_file, name, content)
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
        self.study_resource.save() # this to trigger syncing to elasticsearch


models.signals.pre_save.connect(remove_old_image, sender=StudyResource, weak=False)
models.signals.post_save.connect(sync_to_elastic, sender=StudyResource, weak=False)
models.signals.post_save.connect(warm_study_resource_primary_image, sender=StudyResource, weak=False)
models.signals.post_delete.connect(delete_study_resource_primary_images, sender=StudyResource, weak=False)