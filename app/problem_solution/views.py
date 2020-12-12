from django.shortcuts import render
from django.db.models import Q
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
from django_edit_suggestion.rest_views import ModelViewsetWithEditSuggestion

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.decorators import action
from rest_framework.response import Response

from . import filters
import problem_solution.serializers as serializers
from problem_solution.models import Problem, Solution
from votable.viewsets import VotableVieset
from core.abstract_viewsets import ResourceVieset, EditSuggestionViewset


# Create your views here.

class ProblemViewset(ModelViewsetWithEditSuggestion, ResourceVieset):
    serializer_class = serializers.ProblemSerializer
    queryset = serializers.ProblemSerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    filter_backends = [SearchFilter, OrderingFilter]
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


class SolutionViewset(ModelViewsetWithEditSuggestion, ResourceVieset):
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


class ProblemEditSuggestionViewset(EditSuggestionViewset):
    serializer_class = serializers.ProblemEditSuggestionSerializer
    queryset = serializers.ProblemEditSuggestionSerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]


class SolutionEditSuggestionViewset(EditSuggestionViewset):
    serializer_class = serializers.SolutionEditSuggestionSerializer
    queryset = serializers.SolutionEditSuggestionSerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]


@login_required
def problem_create(request, *args, **kwargs):
    return render(request, 'problem_solution/problem/create_page.html')


def problem_detail(request, id, slug):
    queryset = Problem.objects
    resource = queryset.get(pk=id)
    related = queryset.filter(
        Q(tags__in=resource.tags.all()),
        ~Q(id=resource.id)
    )[:5]
    data = {
        'result': resource,
        'related': related,
        'solutions': resource.solutions.all(),
    }
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
        'problems': resource.problems.all()
    }
    return render(request, 'problem_solution/solution/detail_page_seo.html', data)
