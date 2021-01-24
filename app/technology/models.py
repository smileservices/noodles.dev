from django.db import models
import tsvector_field
from users.models import CustomUser
from django.contrib.postgres.indexes import GinIndex

from votable.models import VotableMixin
from core.abstract_models import SluggableModelMixin, SearchAbleQuerysetMixin
from core.edit_suggestions import edit_suggestion_change_status_condition, post_reject_edit, post_publish_edit
from django_edit_suggestion.models import EditSuggestion
from django.urls import reverse
from category.models import Category


class TechnologyManager(models.Manager):

    def get_queryset(self):
        return TechnologyQueryset(self.model, using=self.db)

    def order_by_rating_then_publishing_date(self):
        return TechnologyQueryset(self.model, using=self.db).order_by(
            models.F('rating').desc(nulls_last=True),
            '-reviews_count',
            'publication_date'
        )


class TechnologyQueryset(SearchAbleQuerysetMixin):
    pass


class Technology(SluggableModelMixin, VotableMixin):
    class LicenseType(models.IntegerChoices):
        PUBLIC_DOMAIN = (0, 'public domain')
        PERMISSIVE_LICENSE = (1, 'permissive license')
        COPYLEFT = (2, 'copyleft')
        NONCOMMERCIAL = (3, 'noncommercial')
        PROPRIETARY = (4, 'proprietary')
        TRADE_SECRET = (5, 'trade secret')

    objects = TechnologyManager()
    name = models.CharField(max_length=128, db_index=True)
    author = models.ForeignKey(CustomUser, null=True, blank=True, on_delete=models.DO_NOTHING)
    description = models.TextField(max_length=1024)
    license = models.IntegerField(default=0, choices=LicenseType.choices, db_index=True)
    url = models.TextField(max_length=1024)
    owner = models.CharField(max_length=128, db_index=True)
    pros = models.TextField(max_length=1024)
    cons = models.TextField(max_length=1024)
    limitations = models.TextField(max_length=1024)
    category = models.ForeignKey(Category, null=True, blank=True, on_delete=models.DO_NOTHING)
    ecosystem = models.ManyToManyField('Technology', related_name='related_technologies')

    edit_suggestions = EditSuggestion(
        excluded_fields=('search_vector_index', 'author', 'thumbs_up_array', 'thumbs_down_array'),
        m2m_fields=[{'name': 'ecosystem', 'model': 'self'}, ],
        change_status_condition=edit_suggestion_change_status_condition,
        post_publish=post_publish_edit,
        post_reject=post_reject_edit,
        bases=(VotableMixin,)
    )

    search_vector_index = tsvector_field.SearchVectorField([
        tsvector_field.WeightedColumn('name', 'A'),
        tsvector_field.WeightedColumn('description', 'B'),
    ], 'english')

    class Meta:
        indexes = [
            GinIndex(fields=['name', 'description'], name='gintrgm_technology_index',
                     opclasses=['gin_trgm_ops', 'gin_trgm_ops'])
        ]

    def __str__(self):
        return f'{self.name}'

    def license_label(self):
        return self.LicenseType(self.license).label

    @property
    def absolute_url(self):
        return reverse('tech-detail', kwargs={'id': self.pk, 'slug': self.slug})
