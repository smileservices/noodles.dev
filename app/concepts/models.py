from django.db import models
from category.models import Category
from users.models import CustomUser
from technology.models import Technology
from mptt.models import MPTTModel, TreeForeignKey
from core.abstract_models import SluggableModelMixin
from votable.models import VotableMixin
from core.abstract_models import DateTimeModelMixin
from django.urls import reverse_lazy
from django.contrib.postgres.fields import JSONField
from django_edit_suggestion.models import EditSuggestion
from core.edit_suggestions import edit_suggestion_change_status_condition, post_publish_edit, post_reject_edit


class AbstractConcept(MPTTModel, SluggableModelMixin, DateTimeModelMixin, VotableMixin):
    class ExperienceLevel(models.IntegerChoices):
        ABEGINNER = (0, 'Absolute Beginner')
        JUNIOR = (1, 'Junior')
        MIDDLE = (2, 'Middle')
        SENIOR = (3, 'Experienced')

    name = models.CharField(max_length=128, db_index=True)
    description = models.TextField(max_length=1024, blank=True, null=True)
    experience_level = models.IntegerField(default=0, choices=ExperienceLevel.choices, db_index=True)
    author = models.ForeignKey(CustomUser, on_delete=models.DO_NOTHING)
    meta = JSONField(null=True, blank=True)

    class Meta:
        abstract = True

    class MPTTMeta:
        order_insertion_by = ['name']

    def __str__(self):
        return self.name

    @property
    def name_tree(self):
        tree_list = [c.name for c in self.get_ancestors()]
        tree_list.append(self.name)
        return ' > '.join(tree_list)

    @property
    def absolute_url(self):
        return reverse_lazy('concept-category-detail', kwargs={'id': self.id, 'slug': self.slug})

    @property
    def experience_level_label(self):
        return self.ExperienceLevel(self.experience_level).label


class CategoryConcept(AbstractConcept):
    parent = TreeForeignKey(
        'self',
        on_delete=models.CASCADE,
        related_name='children',
        null=True, blank=True,
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='concepts'
    )
    edit_suggestions = EditSuggestion(
        excluded_fields=(
            'created_at', 'updated_at', 'author', 'thumbs_up_array', 'thumbs_down_array'),
        special_foreign_fields=['parent',],
        change_status_condition=edit_suggestion_change_status_condition,
        post_publish=post_publish_edit,
        post_reject=post_reject_edit,
        bases=(VotableMixin,)
    )

    @property
    def name_tree(self):
        tree_list = [c.name for c in self.get_ancestors()]
        tree_list.append(self.name)
        return ' > '.join(tree_list)


class TechnologyConcept(AbstractConcept):
    parent = models.ForeignKey(
        CategoryConcept,
        on_delete=models.CASCADE,
        related_name='technology_concepts',
        null=True, blank=True
    )
    technology = models.ForeignKey(
        Technology,
        on_delete=models.CASCADE,
        related_name='concepts'
    )
    edit_suggestions = EditSuggestion(
        excluded_fields=(
            'created_at', 'updated_at', 'author', 'thumbs_up_array', 'thumbs_down_array'),
        change_status_condition=edit_suggestion_change_status_condition,
        post_publish=post_publish_edit,
        post_reject=post_reject_edit,
        bases=(VotableMixin,)
    )
