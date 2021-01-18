import requests
import json
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
from django.db.models import Q
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.filters import OrderingFilter, SearchFilter
from core.abstract_viewsets import ResourceWithEditSuggestionVieset, EditSuggestionViewset
from core.permissions import AuthorOrAdminOrReadOnly, EditSuggestionAuthorOrAdminOrReadOnly
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
        'thumbs_up_array': json.dumps(detail.thumbs_up_array),
        'thumbs_down_array': json.dumps(detail.thumbs_down_array),
        'vote_url': reverse_lazy('techs-viewset-vote', kwargs={'pk': detail.pk}),
    }
    if request.user.is_authenticated:
        return render(request, 'technology/detail_page.html', data)
    return render(request, 'technology/detail_page_seo.html', data)


@login_required
def create(request):
    data = {
        'urls': {
            'tech_api': reverse_lazy('techs-viewset-list'),
            'tech_options_api': reverse_lazy('techs-options-list'),
            'categories_options_api': reverse_lazy('categories-options-list'),
        }
    }
    return render(request, 'technology/create_page.html', data)


@login_required
def edit(request, id):
    data = {
        'urls': {
            'resource_detail': reverse_lazy('techs-viewset-detail', kwargs={'pk': id}),
            'resource_api': reverse_lazy('techs-viewset-list'),

            'edit_suggestions_list': reverse_lazy('techs-viewset-edit-suggestions', kwargs={'pk': id}),
            'edit_suggestions_publish': reverse_lazy('techs-viewset-edit-suggestion-publish', kwargs={'pk': id}),
            'edit_suggestions_reject': reverse_lazy('techs-viewset-edit-suggestion-reject', kwargs={'pk': id}),

            'edit_suggestions_api': reverse_lazy('techs-edit-suggestions-viewset-list'),
            'tag_options_api': reverse_lazy('tags-options-list'),
            'tech_options_api': reverse_lazy('techs-options-list'),
            'categories_options_api': reverse_lazy('categories-options-list'),
        }
    }
    return render(request, 'technology/edit_page.html', data)


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


class TechEditSuggestionViewset(EditSuggestionViewset):
    queryset = Technology.edit_suggestions
    serializer_class = TechnologySerializer.get_edit_suggestion_serializer()
    permission_classes = [EditSuggestionAuthorOrAdminOrReadOnly, ]


class TechViewsetOptions(ModelViewSet):
    serializer_class = TechnologySerializerOption
    queryset = TechnologySerializerOption.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    pagination_class = None
