from django.db import models
from django.urls import reverse
from django.contrib.postgres.indexes import GinIndex
import tsvector_field

from core.abstract_models import SearchAbleQuerysetMixin, DateTimeModelMixin, SluggableModelMixin, ElasticSearchIndexableMixin
from votable.models import VotableMixin

from users.models import CustomUser
from tag.models import Tag
from technology.models import Technology
from study_resource.models import StudyResource


class CollectionQueryset(SearchAbleQuerysetMixin):
    def annotate_with_items_count(self):
        return self.annotate(items_count=models.Count('resources'))


class CollectionManager(models.Manager):
    def get_queryset(self):
        return CollectionQueryset(self.model, using=self.db).annotate_with_items_count()


class Collection(SluggableModelMixin, DateTimeModelMixin, VotableMixin, ElasticSearchIndexableMixin):
    objects = CollectionManager()
    author = models.ForeignKey(CustomUser, null=True, blank=True, on_delete=models.SET_NULL)
    is_public = models.BooleanField(default=False)
    description = models.TextField(null=True, blank=True)
    resources = models.ManyToManyField(
        StudyResource,
        related_name="collections",
        through='CollectionResources'
    )
    tags = models.ManyToManyField(Tag, related_name='collections')
    technologies = models.ManyToManyField(Technology, related_name='collections')
    search_vector_index = tsvector_field.SearchVectorField([
        tsvector_field.WeightedColumn('name', 'A'),
        tsvector_field.WeightedColumn('description', 'B'),
    ], 'english')

    class Meta:
        indexes = [
            GinIndex(fields=['name', 'description'], name='gintrgm_collection_index',
                     opclasses=['gin_trgm_ops', 'gin_trgm_ops'])
        ]

    def __str__(self):
        return f'{self.name} by {self.author}'

    def get_study_resources(self):
        # return study resources of the collection ordered
        # and got through the StudyResourceManager
        pivot_items = self.resources.through.objects \
            .filter(collection=self) \
            .all() \
            .order_by('order')
        resources = list(StudyResource.objects.filter(pk__in=[i.study_resource_id for i in pivot_items]).all())
        ordered_resources = []
        for i in pivot_items:
            for idx, r in enumerate(resources):
                if i.study_resource_id == r.pk:
                    ordered_resources.append(r)
                    del resources[idx]
        return ordered_resources

    def add_resource(self, resource_id):
        self.resources.through.objects.create(
            collection=self,
            study_resource_id=resource_id,
            order=None
        )
        self.save()

    def remove_resource(self, resource_id):
        self.resources.through.objects.get(
            collection=self,
            study_resource_id=resource_id
        ).delete()
        self.save()

    @property
    def absolute_url(self):
        return reverse('collection-detail', kwargs={'id': self.pk, 'slug': self.slug})

    @staticmethod
    def get_elastic_mapping() -> {}:
        return {
            "properties": {
                "pk": {"type": "integer"},

                # model fields
                "name": {"type": "text", "copy_to": "suggest"},
                "url": {"type": "keyword"},
                "is_public": {"type": "boolean"},
                "items_count": {"type": "short"},
                "description": {"type": "text", "copy_to": "suggest"},
                "author": {"type": "nested"},
                "tags": {"type": "keyword"},
                "technologies": {"type": "keyword"},
                "thumbs_up": {"type": "short"},
                "thumbs_down": {"type": "short"},

                "suggest": {
                    "type": "completion",
                }
            }
        }

    def get_elastic_data(self) -> (str, list):
        index_name = 'collections'
        data = {
            "pk": self.pk,
            "name": self.name,
            "url": self.absolute_url,
            "is_public": self.is_public,
            "items_count": self.resources.count(),
            "description": self.description,
            "author": {
                "pk": self.author.pk,
                "username": self.author.username
            },
            "tags": [t.name for t in self.tags.all()],
            "technologies": [t.name for t in self.technologies.all()],
            "thumbs_up": self.thumbs_up,
            "thumbs_down": self.thumbs_down,
        }
        return index_name, data


class CollectionResources(models.Model):
    study_resource = models.ForeignKey(StudyResource, on_delete=models.CASCADE)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    order = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f'study resource {self.study_resource_id} order {self.order} in collection {self.collection_id}'
