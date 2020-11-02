from django.db import models
from django.urls import reverse
from tag.models import Tag
from technology.models import Technology
from simple_history.models import HistoricalRecords
import tsvector_field
from core.abstract_models import SluggableModelMixin, DateTimeModelMixin, RequireAdminAprovalModelMixin, \
    SearchAbleQuerysetMixin
from users.models import CustomUser
from edit_suggestion.models import EditSuggestion
from core.abstract_models import VotableMixin


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


def change_status_condition(instance, user):
    # to be passed to edit suggestion manager
    return True


class Problem(SluggableModelMixin, DateTimeModelMixin, VotableMixin):
    objects = ProblemManager()
    history = HistoricalRecords(excluded_fields=['search_vector_index', 'edit_suggestions'])
    edit_suggestions = EditSuggestion(
        excluded_fields=[
            'search_vector_index',
            'history',
            'author',
            'thumbs_up_array',
            'thumbs_down_array',
            'created_at',
            'updated_at'
        ],
        m2m_fields=({
                        'name': 'tags',
                        'model': Tag,
                    },),
        change_status_condition=change_status_condition,
        bases=(VotableMixin,)
    )
    author = models.ForeignKey(CustomUser, null=True, blank=True, on_delete=models.DO_NOTHING)

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


class Solution(SluggableModelMixin, DateTimeModelMixin, VotableMixin):
    objects = SolutionManager()
    history = HistoricalRecords(excluded_fields=['search_vector_index'])
    author = models.ForeignKey(CustomUser, null=True, blank=True, on_delete=models.DO_NOTHING)

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
