from django.db import models
from core.abstract_models import SearchAbleQuerysetMixin, DateTimeModelMixin, SluggableModelMixin
from votable.models import VotableMixin

from users.models import CustomUser
from tag.models import Tag
from technology.models import Technology
from study_resource.models import StudyResource

class CollectionQueryset(models.QuerySet):
    def annotate_with_items_count(self):
        return self.annotate(items_count=models.Count('resources'))


class CollectionManager(models.Manager):
    def get_queryset(self):
        return CollectionQueryset(self.model, using=self.db).annotate_with_items_count()


class Collection(DateTimeModelMixin, VotableMixin):
    objects = CollectionManager()
    name = models.CharField(max_length=128)
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

    def __str__(self):
        return f'{self.name} by {self.author}'

    def add_resource(self, resource_id):
        self.resources.through.objects.create(
            collection=self,
            study_resource_id=resource_id,
            order=None
        )


class CollectionResources(models.Model):
    study_resource = models.ForeignKey(StudyResource, on_delete=models.CASCADE)
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE)
    order = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f'study resource {self.study_resource_id} order {self.order} in collection {self.collection_id}'