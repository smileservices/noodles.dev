from django.shortcuts import render
from django.db.models import Q
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth.decorators import login_required
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.filters import OrderingFilter, SearchFilter
from django.urls import reverse_lazy
from . import filters
import problem_solution.serializers as serializers
from problem_solution.models import Problem, Solution

# Create your views here.

class ProblemViewset(ModelViewSet):
    serializer_class = serializers.ProblemSerializer
    queryset = serializers.ProblemSerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description', 'published_by', 'tags__name']

    def get_success_headers(self, data):
        return {'Location': reverse_lazy('problem-detail', kwargs={'id': data['pk'], 'slug': data['slug']})}


class SolutionViewset(ModelViewSet):
    serializer_class = serializers.SolutionSerializer
    queryset = serializers.SolutionSerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description', 'published_by', 'tags__name', 'technologies__name']


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
    }
    return render(request, 'problem_solution/problem/detail_page.html', data)


def solution_detail(request, *args, **kwargs):
    pass
