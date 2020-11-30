import requests
from django.shortcuts import render
from django.db.models import Q
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.filters import OrderingFilter, SearchFilter

from django_edit_suggestion.rest_views import ModelViewsetWithEditSuggestion
from .serializers import TechnologySerializer, TechnologySerializerOption, TechnologyEditSerializer
from .models import Technology


def detail(request, id):
    queryset = Technology.objects
    detail = queryset.get(pk=id)
    root_tech = Technology.objects.filter(Q(name=detail.name, version__isnull=True)).exclude(pk=detail.pk)
    solutions = detail.solutions
    similar_techs = []
    for tech_list in [solution.technologies.all() for solution in solutions.all()]:
        similar_techs += tech_list
    related_resources = []
    data = {
        'root_tech': root_tech,
        'result': detail,
        'solutions': solutions,
        'similar': similar_techs,
        'related_resources': related_resources,
    }
    return render(request, 'technology/detail_page.html', data)


class TechViewset(ModelViewsetWithEditSuggestion):
    serializer_class = TechnologySerializer
    queryset = TechnologySerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']

    @action(methods=['POST'], detail=False)
    def validate_url(self, request, *args, **kwargs):
        try:
            url_request = requests.get(request.data['url'])
            if url_request.status_code != 200:
                return Response({
                    'error': True,
                    'message': 'The url is not giving a valid response. Please check it again.'
                })
        except Exception as e:
            return Response({
                'error': True,
                'message': str(e)
            })
        return Response({
            'error': False
        })


class TechViewsetOptions(ModelViewSet):
    serializer_class = TechnologySerializerOption
    queryset = TechnologySerializerOption.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    pagination_class = None
