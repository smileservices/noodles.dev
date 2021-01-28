from django_filters.rest_framework import FilterSet as RestFilterSet
from django_filters.filterset import FilterSet
from django_filters.filters import OrderingFilter, DateFilter, CharFilter, ModelMultipleChoiceFilter, ChoiceFilter
from django.forms import DateInput
from . import models
from django.db.models import Q


class TechnologyFilterRest(RestFilterSet):
    class Meta:
        model = models.Technology
        fields = {
            'ecosystem': ['exact'],
            'category': ['exact'],
            'license': ['exact'],
        }
