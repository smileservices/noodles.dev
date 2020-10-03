from django_filters.rest_framework import FilterSet as RestFilterSet
from django_filters.filterset import FilterSet
from django_filters.filters import OrderingFilter, DateFilter, CharFilter, ModelMultipleChoiceFilter, ChoiceFilter
from django.forms import DateInput
from . import models
from django.db.models import Q


class StudyResourceFilterRest(RestFilterSet):
    class Meta:
        model = models.StudyResource
        fields = {
            'name': ['icontains'],
            'tags': ['exact'],
            'technologies': ['exact'],
            'publication_date': ['lt', 'gt'],
            'price': ['exact'],
            'media': ['exact'],
        }


class StudyResourceFilter(FilterSet):
    contains = CharFilter(label='Contains', method='search')
    publication_date_before = DateFilter(
        lookup_expr='lt',
        field_name='publication_date',
        label='Published before',
        widget=DateInput(attrs={
            'type': 'date',
            'class': 'datepicker',
        }))
    publication_date_after = DateFilter(
        lookup_expr='gt',
        field_name='publication_date',
        label='Published after',
        widget=DateInput(attrs={
            'type': 'date',
            'class': 'datepicker'
        }))

    tags = ModelMultipleChoiceFilter(
        queryset=models.Tag.objects.all(),
        lookup_expr='exact',
    )

    technologies = ModelMultipleChoiceFilter(
        queryset=models.Technology.objects.all(),
        lookup_expr='exact',
    )

    price = ChoiceFilter(
        lookup_expr='exact',
        choices=models.StudyResource.Price.choices
    )

    media = ChoiceFilter(
        lookup_expr='exact',
        choices=models.StudyResource.Media.choices
    )

    ordering_by_date = OrderingFilter(
        fields=(
            ('publication_date', 'publication_date'),
            ('created_at', 'created_at'),
        )
    )

    class Meta:
        model = models.StudyResource
        fields = [
            'contains',
            'price',
            'media',
            'tags',
            'technologies',
            'publication_date_before',
            'publication_date_after',
            'ordering_by_date',
        ]


class StudyResourceFilterMatches(StudyResourceFilter):

    def search(self, queryset, name, value):
        return queryset.search_match(value, min_rank=0.01)


class StudyResourceFilterSimilar(StudyResourceFilter):

    def search(self, queryset, name, value):
        return queryset.search_similar(['name', 'summary'], value, min_sim=0.2)
