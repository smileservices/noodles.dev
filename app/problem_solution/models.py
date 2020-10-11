from django.db import models
from django.urls import reverse
from tag.models import Tag
from technology.models import Technology
from simple_history.models import HistoricalRecords
import tsvector_field
from core.abstract_models import SluggableModelMixin, DateTimeModelMixin, RequireAdminAprovalModelMixin, \
    SearchAbleQuerysetMixin


class ProblemQueryset(SearchAbleQuerysetMixin):
    pass


class SolutionQueryset(SearchAbleQuerysetMixin):
    pass


class ProblemManager(models.Manager):
    def get_queryset(self):
        return ProblemQueryset(self.model, using=self.db)


class SolutionManager(models.Manager):
    def get_queryset(self):
        return SolutionQueryset(self.model, using=self.db)


class Problem(SluggableModelMixin, DateTimeModelMixin):
    objects = ProblemManager()
    history = HistoricalRecords(excluded_fields='search_vector_index')

    description = models.TextField(max_length=3048)
    parent = models.ForeignKey('Solution', null=True, blank=True, on_delete=models.CASCADE, related_name='problems')
    tags = models.ManyToManyField(Tag, related_name='problems')

    search_vector_index = tsvector_field.SearchVectorField([
        tsvector_field.WeightedColumn('name', 'A'),
        tsvector_field.WeightedColumn('description', 'B'),
    ], 'english')

    def __str__(self):
        return self.name

    @property
    def absolute_url(self):
        return reverse('problem-detail', kwargs={'id': self.id, 'slug': self.slug})


class Solution(SluggableModelMixin, DateTimeModelMixin):
    objects = SolutionManager()
    history = HistoricalRecords(excluded_fields='search_vector_index')

    description = models.TextField(max_length=3048)
    parent = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='solutions')
    tags = models.ManyToManyField(Tag, related_name='solutions')
    technologies = models.ManyToManyField(Technology, related_name='solutions')

    search_vector_index = tsvector_field.SearchVectorField([
        tsvector_field.WeightedColumn('name', 'A'),
        tsvector_field.WeightedColumn('description', 'B'),
    ], 'english')

    @property
    def absolute_url(self):
        return reverse('solution-detail', kwargs={'id': self.id, 'slug': self.slug})
