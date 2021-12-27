from django.db import models
from django.contrib.postgres.fields import JSONField
from users.models import CustomUser
from django.conf import settings
from versatileimagefield.fields import VersatileImageField
from versatileimagefield.image_warmer import VersatileImageFieldWarmer
from versatileimagefield.utils import build_versatileimagefield_url_set
from votable.models import VotableMixin
from core.abstract_models import SluggableModelMixin, ElasticSearchIndexableMixin, ResourceMixin
from core.edit_suggestions import edit_suggestion_change_status_condition, post_reject_edit, post_publish_edit
from django_edit_suggestion.models import EditSuggestion
from django.urls import reverse
from category.models import Category
from core import tasks
from django.template.defaultfilters import slugify


def delete_technology_images(sender, instance, **kwargs):
    """
    Deletes Technology image renditions on post_delete.
    """
    instance.image_file.delete_all_created_images()
    instance.image_file.delete(save=False)


def warm_technology_logos(sender, instance, **kwargs):
    """Ensures Technologies logos are created post-save"""
    sr_images_warmer = VersatileImageFieldWarmer(
        instance_or_queryset=instance,
        rendition_key_set='technology_logo',
        image_attr='image_file'
    )
    num_created, failed_to_create = sr_images_warmer.warm()


def remove_old_image(sender, instance, **kwargs):
    if kwargs['update_fields'] and 'image_file' in kwargs['update_fields']:
        db_instance = sender.objects.get(pk=instance.pk)
        if db_instance.image_file != instance.image_file:
            db_instance.image_file.delete_all_created_images()
            db_instance.image_file.delete(save=False)


class TechnologyManager(models.Manager):

    def order_by_rating_then_publishing_date(self):
        return self.get_queryset(self.model, using=self.db).order_by(
            models.F('rating').desc(nulls_last=True),
            '-reviews_count',
            'publication_date'
        )


class Technology(ResourceMixin, VotableMixin):
    elastic_index = 'technologies'

    class LicenseType(models.IntegerChoices):
        PUBLIC_DOMAIN = (0, 'Public Domain')
        PERMISSIVE_LICENSE = (1, 'Permissive License')
        COPYLEFT = (2, 'Copyleft')
        NONCOMMERCIAL = (3, 'Non-Commercial')
        PROPRIETARY = (4, 'Proprietary')
        TRADE_SECRET = (5, 'Trade Secret')

    objects = TechnologyManager()
    name = models.CharField(max_length=128, db_index=True)
    author = models.ForeignKey(CustomUser, null=True, blank=True, on_delete=models.DO_NOTHING)
    description = models.TextField(max_length=256)
    description_long = models.TextField(blank=True, null=True)
    license = models.IntegerField(default=0, choices=LicenseType.choices, db_index=True)
    url = models.TextField(max_length=1024)
    owner = models.CharField(max_length=128, db_index=True)

    image_file = VersatileImageField(upload_to='technologies', blank=True, null=True)
    featured = models.BooleanField(default=False, db_index=True)
    meta = JSONField(blank=True, null=True)

    category = models.ManyToManyField(Category, related_name='related_technologies')
    ecosystem = models.ManyToManyField('Technology', related_name='related_technologies')
    category_concepts = models.ManyToManyField('concepts.CategoryConcept', related_name='related_technologies')

    edit_suggestions = EditSuggestion(
        excluded_fields=('slug', 'author', 'thumbs_up_array', 'thumbs_down_array', 'created_at', 'updated_at', 'status'),
        m2m_fields=[{'name': 'ecosystem', 'model': 'self'}, {'name': 'category', 'model': Category},
                    {'name': 'category_concepts', 'model': 'concepts.CategoryConcept'}],
        change_status_condition=edit_suggestion_change_status_condition,
        post_publish=post_publish_edit,
        post_reject=post_reject_edit,
        bases=(VotableMixin,),
        signals={
            'post_save': [warm_technology_logos, ],
            'post_delete': [delete_technology_images, ]
        },
        attrs_to_be_copied=['logo', ]
    )

    def __str__(self):
        return f'{self.name}'

    @property
    def license_label(self):
        return self.LicenseType(self.license).label

    @property
    def absolute_url(self):
        return reverse('tech-detail', kwargs={'slug': self.slug})

    @property
    def logo(self):
        return build_versatileimagefield_url_set(
            self.image_file,
            settings.VERSATILEIMAGEFIELD_RENDITION_KEY_SETS['technology_logo']
        )

    @staticmethod
    def get_elastic_mapping() -> {}:
        return {
            "properties": {
                "pk": {"type": "integer"},
                "resource_type": {"type": "keyword"},
                "status": {"type": "keyword"},

                # model fields
                "name": {
                    "type": "text",
                    "copy_to": "suggest",
                    "analyzer": "ngram",
                    "search_analyzer": "standard"
                },
                "description": {
                    "type": "text",
                    "copy_to": "suggest",
                    "analyzer": "ngram",
                    "search_analyzer": "standard"
                },
                "logo": {"type": "nested"},
                "url": {"type": "keyword"},
                "license": {"type": "keyword"},
                "featured": {"type": "boolean"},
                "owner": {"type": "text"},
                "author": {"type": "nested"},
                "category": {"type": "keyword"},
                "ecosystem": {"type": "keyword"},
                "thumbs_up": {"type": "short"},
                "thumbs_down": {"type": "short"},

                "suggest": {
                    "type": "search_as_you_type",
                }
            }
        }

    def get_elastic_data(self) -> (str, list):
        data = {
            "pk": self.pk,
            "type": "technology",
            "status": self.status_label,
            "name": self.name,
            "logo": self.logo if self.image_file else {},
            "url": self.absolute_url,
            "license": self.license_label,
            "featured": self.featured,
            "description": self.description,
            "owner": self.owner,
            "author": {
                "pk": self.author.pk,
                "username": self.author.username
            } if self.author else {},
            "category": [c.name for c in self.category.all()],
            "ecosystem": [t.name for t in self.ecosystem.all()],
            "thumbs_up": self.thumbs_up,
            "thumbs_down": self.thumbs_down,
        }
        return self.elastic_index, data

    def save(self, *args, **kwargs):
        # override the save method to add the updated fields
        if self.pk:
            # If self.pk is not None then it's an update.
            # This will get the current model state since super().save() isn't called yet.
            new = self  # This gets the newly instantiated Mode object with the new values.
            old = self.__class__.objects.get(pk=self.pk)
            changed_fields = []
            for field in self.__class__._meta.get_fields():
                try:
                    if getattr(old, field.name) != getattr(new, field.name):
                        changed_fields.append(field.name)
                except Exception as ex:  # Catch field does not exist exception
                    pass
            kwargs['update_fields'] = changed_fields
        else:
            if not self.slug:
                self.slug = slugify(self.name)
        super().save(*args, **kwargs)


models.signals.post_save.connect(tasks.sync_technology_resources_to_elastic, sender=Technology, weak=False)
models.signals.post_save.connect(warm_technology_logos, sender=Technology, weak=False)
# we need to keep the images for the history
# models.signals.post_delete.connect(delete_technology_images, sender=Technology, weak=False)
# models.signals.pre_save.connect(remove_old_image, sender=Technology, weak=False)
