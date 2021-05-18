from django.db import models
from category.models import Category
from technology.models import Technology
from mptt.models import MPTTModel, TreeForeignKey
from core.abstract_models import SluggableModelMixin
from votable.models import VotableMixin
from core.abstract_models import DateTimeModelMixin


class AbstractConcept(MPTTModel, SluggableModelMixin, DateTimeModelMixin, VotableMixin):
    class ExperienceLevel(models.IntegerChoices):
        ABEGINNER = (0, 'Absolute Beginner')
        JUNIOR = (1, 'Junior')
        MIDDLE = (2, 'Middle')
        SENIOR = (3, 'Experienced')

    name = models.CharField(max_length=128, db_index=True)
    description = models.TextField(max_length=1024, blank=True, null=True)
    experience_level = models.IntegerField(default=0, choices=ExperienceLevel.choices, db_index=True)

    class Meta:
        abstract = True

    class MPTTMeta:
        order_insertion_by = ['name']

    def __str__(self):
        return self.name


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
