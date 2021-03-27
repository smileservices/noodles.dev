from django.db import models
from django.urls import reverse
from tag.models import Tag
from technology.models import Technology
from core.abstract_models import SluggableModelMixin, DateTimeModelMixin, RequireAdminAprovalModelMixin, \
    SearchAbleQuerysetMixin
from users.models import CustomUser
from django_edit_suggestion.models import EditSuggestion
from votable.models import VotableMixin
from core.edit_suggestions import edit_suggestion_change_status_condition, post_publish_edit, post_reject_edit
from category.models import Category


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


class Problem(SluggableModelMixin, DateTimeModelMixin, VotableMixin):
    objects = ProblemManager()
    edit_suggestions = EditSuggestion(
        excluded_fields=[
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
        change_status_condition=edit_suggestion_change_status_condition,
        post_publish=post_publish_edit,
        post_reject=post_reject_edit,
        bases=(VotableMixin,)
    )
    author = models.ForeignKey(CustomUser, null=True, blank=True, on_delete=models.DO_NOTHING)
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.DO_NOTHING)

    description = models.TextField(max_length=3048)
    parent = models.ForeignKey('Solution', null=True, blank=True, on_delete=models.CASCADE, related_name='problems')
    tags = models.ManyToManyField(Tag, related_name='problems')

    def __str__(self):
        return self.name

    @property
    def absolute_url(self):
        return reverse('problem-detail', kwargs={'id': self.id, 'slug': self.slug})


class Solution(SluggableModelMixin, DateTimeModelMixin, VotableMixin):
    objects = SolutionManager()
    author = models.ForeignKey(CustomUser, null=True, blank=True, on_delete=models.DO_NOTHING)

    description = models.TextField(max_length=3048)
    parent = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='solutions')
    tags = models.ManyToManyField(Tag, related_name='solutions')
    technologies = models.ManyToManyField(Technology, related_name='solutions')

    edit_suggestions = EditSuggestion(
        excluded_fields=[
            'author',
            'thumbs_up_array',
            'thumbs_down_array',
            'created_at',
            'updated_at'
        ],
        m2m_fields=({
                        'name': 'tags',
                        'model': Tag,
                    }, {
                        'name': 'technologies',
                        'model': Technology
                    }),
        change_status_condition=edit_suggestion_change_status_condition,
        post_publish=post_publish_edit,
        post_reject=post_reject_edit,
        bases=(VotableMixin,)
    )

    @property
    def absolute_url(self):
        return reverse('solution-detail', kwargs={'id': self.id, 'slug': self.slug})
