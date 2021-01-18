from django.shortcuts import render
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
from django_edit_suggestion.rest_views import ModelViewsetWithEditSuggestion
import json
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from . import filters
import problem_solution.serializers as serializers
from problem_solution.models import Problem, Solution
from votable.viewsets import VotableVieset
from core.abstract_viewsets import ResourceWithEditSuggestionVieset, EditSuggestionViewset
from core.permissions import AuthorOrAdminOrReadOnly, EditSuggestionAuthorOrAdminOrReadOnly


# Create your views here.

class ProblemViewset(ResourceWithEditSuggestionVieset):
    serializer_class = serializers.ProblemSerializer
    queryset = serializers.ProblemSerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    filter_backends = [SearchFilter, DjangoFilterBackend, OrderingFilter]
    search_fields = ['name', 'description', 'published_by', 'tags__name']
    m2m_fields = ('tags',)

    def get_success_headers(self, data):
        return {'Location': reverse_lazy('problem-detail', kwargs={'id': data['pk'], 'slug': data['slug']})}

    @action(methods=['GET'], detail=True)
    def solutions(self, request, *args, **kwargs):
        queryset = serializers.SolutionSerializerShort.queryset.filter(
            parent=self.kwargs['pk']
        )
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = serializers.SolutionSerializerShort(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = serializers.SolutionSerializerShort(queryset, many=True)
        return Response(serializer.data)


class SolutionViewset(ResourceWithEditSuggestionVieset):
    serializer_class = serializers.SolutionSerializer
    queryset = serializers.SolutionSerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description', 'published_by', 'tags__name', 'technologies__name']
    m2m_fields = ('tags', 'technologies')

    @action(methods=['GET'], detail=True)
    def problems(self, request, *args, **kwargs):
        queryset = serializers.ProblemSerializerShort.queryset.filter(
            parent=self.kwargs['pk']
        )
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = serializers.ProblemSerializerShort(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = serializers.ProblemSerializerShort(queryset, many=True)
        return Response(serializer.data)


@login_required
def problem_create(request, *args, **kwargs):
    data = {
        'urls': {
            'resource_api': reverse_lazy('problem-viewset-list'),
            'categories_options_api': reverse_lazy('categories-options-list'),
            'tag_options_api': reverse_lazy('tags-options-list'),
        }
    }
    return render(request, 'problem_solution/problem/create_page.html', data)


def problem_detail(request, id, slug):
    queryset = Problem.objects
    resource = queryset.get(pk=id)
    related = queryset.filter(
        Q(tags__in=resource.tags.all()),
        ~Q(id=resource.id)
    )[:5]
    data = {
        'result': resource,
        'thumbs_up_array': json.dumps(resource.thumbs_up_array),
        'thumbs_down_array': json.dumps(resource.thumbs_down_array),
        'related': related,
        'solutions': resource.solutions.all(),
        'urls': {
            'tech_api': reverse_lazy('techs-viewset-list'),
            'vote_api': reverse_lazy('problem-viewset-vote', kwargs={'pk': resource.pk}),
            'categories_options_api': reverse_lazy('categories-options-list'),
            'tag_options_api': reverse_lazy('tags-options-list'),
            'tech_options_api': reverse_lazy('techs-options-list'),
            'solutions_list': reverse_lazy('problem-viewset-solutions', kwargs={'pk': resource.pk}),
            'solution_api': reverse_lazy('solution-viewset-list')
        }
    }
    if request.user.is_authenticated:
        return render(request, 'problem_solution/problem/detail_page.html', data)
    return render(request, 'problem_solution/problem/detail_page_seo.html', data)


def solution_detail(request, id, slug):
    queryset = Solution.objects
    resource = queryset.get(pk=id)
    related = queryset.filter(
        Q(tags__in=resource.tags.all()),
        Q(technologies__in=resource.technologies.all()),
        ~Q(id=resource.id)
    )[:5]
    data = {
        'result': resource,
        'related': related,
        'problems': resource.problems.all(),
        'thumbs_up_array': json.dumps(resource.thumbs_up_array),
        'thumbs_down_array': json.dumps(resource.thumbs_down_array),
        'urls': {
            'vote_api': reverse_lazy('solution-viewset-vote', kwargs={'pk': resource.pk}),
            'tag_options_api': reverse_lazy('tags-options-list'),
            'problems_list': reverse_lazy('solution-viewset-problems', kwargs={'pk': resource.pk}),
            'problem_api': reverse_lazy('problem-viewset-list')
        }
    }
    if request.user.is_authenticated:
        return render(request, 'problem_solution/solution/detail_page.html', data)
    return render(request, 'problem_solution/solution/detail_page_seo.html', data)


@login_required
def problem_edit(request, id):
    data = {
        'urls': {
            'resource_detail': reverse_lazy('problem-viewset-detail', kwargs={'pk': id}),

            'edit_suggestions_list': reverse_lazy('problem-viewset-edit-suggestions', kwargs={'pk': id}),
            'edit_suggestions_publish': reverse_lazy('problem-viewset-edit-suggestion-publish', kwargs={'pk': id}),
            'edit_suggestions_reject': reverse_lazy('problem-viewset-edit-suggestion-reject', kwargs={'pk': id}),

            'resource_api': reverse_lazy('problem-viewset-list'),
            'edit_suggestions_api': reverse_lazy('problem-edit-suggestion-viewset-list'),
            'tag_options_api': reverse_lazy('tags-options-list'),
            'categories_options_api': reverse_lazy('categories-options-list'),
        }
    }
    return render(request, 'problem_solution/problem/edit_page.html', data)


@login_required
def solution_edit(request, id):
    data = {
        'resource_detail': reverse_lazy('solution-viewset-detail', kwargs={'pk': id}),
        'edit_suggestions_list': reverse_lazy('solution-viewset-edit-suggestions', kwargs={'pk': id}),
        'edit_suggestions_publish': reverse_lazy('solution-viewset-edit-suggestion-publish', kwargs={'pk': id}),
        'edit_suggestions_reject': reverse_lazy('solution-viewset-edit-suggestion-reject', kwargs={'pk': id}),

        'edit_suggestions_api': reverse_lazy('solution-edit-suggestion-viewset-list'),
        'resource_api': reverse_lazy('solution-viewset-list'),
        'tag_options_api': reverse_lazy('tags-options-list'),
        'tech_options_api': reverse_lazy('techs-options-list'),
        'tech_api': reverse_lazy('techs-viewset-list'),
    }
    return render(request, 'problem_solution/solution/edit_page.html', data)


class ProblemEditSuggestionViewset(EditSuggestionViewset):
    queryset = Problem.edit_suggestions
    serializer_class = serializers.ProblemSerializer.get_edit_suggestion_serializer()
    permission_classes = [EditSuggestionAuthorOrAdminOrReadOnly, ]


class SolutionEditSuggestionViewset(EditSuggestionViewset):
    queryset = Solution.edit_suggestions
    serializer_class = serializers.SolutionSerializer.get_edit_suggestion_serializer()
    permission_classes = [EditSuggestionAuthorOrAdminOrReadOnly, ]
