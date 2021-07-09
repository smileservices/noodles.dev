from django_filters.rest_framework import FilterSet as RestFilterSet
from . import models


class HistoryFilterRest(RestFilterSet):
    class Meta:
        model = models.ResourceHistoryModel
        fields = {
            'operation_type': ['exact'],
            'operation_source': ['exact'],
            'author': ['exact'],
        }
