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


class ProblemFilterMatches(ProblemFilter):

    def search(self, queryset, name, value):
        return queryset.search_match(value, min_rank=0.01)


class ProblemFilterSimilar(ProblemFilter):

    def search(self, queryset, name, value):
        return queryset.search_similar(['name', 'description'], value, min_sim=0.2)
