from django.db import models
from category.models import Category
from users.models import CustomUser
from technology.models import Technology
from mptt.models import MPTTModel
from mptt.fields import TreeForeignKey
from core.abstract_models import SluggableModelMixin
from votable.models import VotableMixin
from core.abstract_models import DateTimeModelMixin
from django.urls import reverse
from django.contrib.postgres.fields import JSONField
from django_edit_suggestion.models import EditSuggestion
from core.edit_suggestions import edit_suggestion_change_status_condition, post_publish_edit, post_reject_edit


class AbstractConcept(SluggableModelMixin, DateTimeModelMixin, VotableMixin):
    class ExperienceLevel(models.IntegerChoices):
        ABEGINNER = (0, 'Absolute Beginner')
        JUNIOR = (1, 'Junior')
        MIDDLE = (2, 'Middle')
        SENIOR = (3, 'Experienced')

    name = models.CharField(max_length=128, db_index=True)
    description = models.TextField(max_length=256, blank=True, null=True)
    description_long = models.TextField(blank=True, null=True)
    experience_level = models.IntegerField(default=0, choices=ExperienceLevel.choices, db_index=True)
    author = models.ForeignKey(CustomUser, on_delete=models.DO_NOTHING)
    meta = JSONField(null=True, blank=True)

    class Meta:
        abstract = True

    def __str__(self):
        return self.name

    @property
    def experience_level_label(self):
        return self.ExperienceLevel(self.experience_level).label

    @property
    def get_ahref(self):
        return f"<a class='concept' href='{self.absolute_url}'>{self.name}</a>"

    @property
    def absolute_url(self):
        raise NotImplementedError('Must implement absolute_url method')


class CategoryConcept(MPTTModel, AbstractConcept):
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
        special_foreign_fields=['parent', ],
        change_status_condition=edit_suggestion_change_status_condition,
        post_publish=post_publish_edit,
        post_reject=post_reject_edit,
        bases=(VotableMixin,)
    )

    class MPTTMeta:
        order_insertion_by = ['name']

    @property
    def name_tree(self):
        tree_list = [c.name for c in self.get_ancestors()]
        tree_list.append(self.name)
        return ' / '.join(tree_list)

    @property
    def name_tree_urls(self):
        tree_list = [c.get_ahref for c in self.get_ancestors()]
        tree_list.append(self.get_ahref)
        return ' / '.join(tree_list)

    @property
    def absolute_url(self):
        return reverse('concept-category-detail', kwargs={'id': self.id, 'slug': self.slug})


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

    @property
    def absolute_url(self):
        return reverse('concept-technology-detail', kwargs={'id': self.id, 'slug': self.slug})
