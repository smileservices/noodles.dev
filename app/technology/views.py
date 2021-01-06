import requests
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.filters import OrderingFilter, SearchFilter
from core.abstract_viewsets import ResourceWithEditSuggestionVieset
from .serializers import TechnologySerializer, TechnologySerializerOption, TechnologyEditSerializer
from .models import Technology


def detail(request, id, slug):
    queryset = Technology.objects
    detail = queryset.get(pk=id)
    solutions = detail.solutions
    similar_techs = []
    for tech_list in [solution.technologies.all() for solution in solutions.all()]:
        similar_techs += tech_list
    related_resources_techs = detail.studyresourcetechnology_set.all()
    data = {
        'result': detail,
        'solutions': solutions,
        'similar': similar_techs,
        'related_resources_techs': related_resources_techs,
    }
    return render(request, 'technology/detail_page_seo.html', data)


@login_required
def create(request):
    return render(request, 'technology/create_page.html')


class TechViewset(ResourceWithEditSuggestionVieset):
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