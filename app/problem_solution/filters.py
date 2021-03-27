from django_filters.filterset import FilterSet
from django_filters.filters import OrderingFilter, CharFilter, ModelMultipleChoiceFilter
from . import models
from django.db.models import Q


class ProblemFilter(FilterSet):
    contains = CharFilter(label='Contains', method='search')
    tags = ModelMultipleChoiceFilter(
        queryset=models.Tag.objects.all(),
        lookup_expr='exact',
    )

    ordering_by_date = OrderingFilter(
        fields=(
            ('created_at', 'created_at'),
        )
    )

    class Meta:
        model = models.Problem
        fields = [
            'contains',
            'tags',
            'ordering_by_date',
        ]
