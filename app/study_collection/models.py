from django.db import models
from django.urls import reverse
from django.contrib.postgres.indexes import GinIndex
import tsvector_field

from core.abstract_models import SearchAbleQuerysetMixin, DateTimeModelMixin, SluggableModelMixin
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


class Collection(SluggableModelMixin, DateTimeModelMixin, VotableMixin):
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
            GinIndex(fields=['name', 'description'], name='gintrgm_collection_index', opclasses=['gin_trgm_ops', 'gin_trgm_ops'])
        ]

    def __str__(self):
        return f'{self.name} by {self.author}'

    def add_resource(self, resource_id):
        self.resources.through.objects.create(
            collection=self,
            study_resource_id=resource_id,
            order=None
        )

    @property
    def absolute_url(self):
        return reverse('collection-detail', kwargs={'id': self.pk, 'slug': self.slug})


class CollectionResources(models.Model):
    study_resource = models.ForeignKey(StudyResource, on_delete=models.CASCADE)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    order = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f'study resource {self.study_resource_id} order {self.order} in collection {self.collection_id}'
