from django_filters.rest_framework import FilterSet as RestFilterSet
from django_filters.filterset import FilterSet
from django_filters.filters import OrderingFilter, DateFilter, CharFilter, ModelMultipleChoiceFilter, ChoiceFilter
from django.forms import DateInput
from . import models
from django.db.models import Q


class CollectionFilterRest(RestFilterSet):
    class Meta:
        model = models.Collection
        fields = {
            'tags': ['exact'],
            'technologies': ['exact'],
            'author_id': ['exact'],
            'is_public': ['exact']
        }