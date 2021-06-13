import requests
import json
from django.shortcuts import render
from django.http.response import JsonResponse
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.filters import OrderingFilter, SearchFilter
from core.abstract_viewsets import ResourceWithEditSuggestionVieset, EditSuggestionViewset
from core.permissions import AuthorOrAdminOrReadOnly, EditSuggestionAuthorOrAdminOrReadOnly
from study_collection.models import Collection
from study_resource.models import StudyResource
from . import filters
from .serializers import TechnologySerializer, TechnologySerializerOption, TechnologyListing
from .models import Technology
from django.views.decorators.cache import cache_page
from app.settings import rewards

def detail(request, slug):
    queryset = Technology.objects
    detail = queryset.select_related().get(slug=slug)
    resources_ids = [tech['study_resource_id'] for tech in
                     detail.studyresourcetechnology_set.values('study_resource_id').all()]
    collections_paginator = Paginator(Collection.objects.filter(technologies=detail).select_related().order_by('created_at'), 4)
    resources_paginator = Paginator(StudyResource.objects.filter(pk__in=resources_ids).select_related().order_by('created_at'), 4)
    try:
        collections = collections_paginator.page(request.GET.get('page', 1))
    except PageNotAnInteger:
        collections = collections_paginator.page(1)
    except EmptyPage:
        collections = collections_paginator.page(collections_paginator.num_pages)
    try:
        resources = resources_paginator.page(request.GET.get('page', 1))
    except PageNotAnInteger:
        resources = resources_paginator.page(1)
    except EmptyPage:
        resources = resources_paginator.page(resources_paginator.num_pages)
    data = {
        'result': detail,
        'concepts': detail.concepts.values('name', 'pk', 'slug').order_by('experience_level').all(),
        'collections': collections,
        'collections_paginator': collections_paginator,
        'resources': resources,
        'resources_paginator': resources_paginator,
        'thumbs_up_array': json.dumps(detail.thumbs_up_array),
        'thumbs_down_array': json.dumps(detail.thumbs_down_array),
        'vote_url': reverse_lazy('techs-viewset-vote', kwargs={'pk': detail.pk}),
    }
    if request.user.is_authenticated:
        return render(request, 'technology/detail_page.html', data)
    return render(request, 'technology/detail_page_seo.html', data)


def list_all(request):
    queryset = Technology.objects.all()
    paginator = Paginator(queryset, 10)
    try:
        results = paginator.page(request.GET.get('page', 1))
    except PageNotAnInteger:
        results = paginator.page(1)
    except EmptyPage:
        results = paginator.page(paginator.num_pages)
    data = {
        'paginator': paginator,
        'results': results,
    }
    return render(request, 'technology/list_page_seo.html', data)


@login_required
def create(request):
    data = {
        'data': {
            'reward': rewards.RESOURCE_CREATE
        },
        'urls': {
            'tech_api': reverse_lazy('techs-viewset-list'),
            'tech_options_api': reverse_lazy('techs-options-list'),
            'categories_options_api': reverse_lazy('categories-options-list'),
            'license_options': reverse_lazy('license-options'),
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
            'license_options': reverse_lazy('license-options'),
        }
    }
    return render(request, 'technology/edit_page.html', data)


class TechViewset(ResourceWithEditSuggestionVieset):
    serializer_class = TechnologySerializer
    queryset = TechnologySerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    filter_backends = [SearchFilter, OrderingFilter]
    filterset_class = filters.TechnologyFilterRest
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


@cache_page(60 * 5)
def license_options(request):
    license = [{'value': o[0], 'label': o[1]} for o in Technology.LicenseType.choices]
    return JsonResponse(license, safe=False)


class TechEditSuggestionViewset(EditSuggestionViewset):
    queryset = Technology.edit_suggestions
    serializer_class = TechnologySerializer.get_edit_suggestion_serializer()
    permission_classes = [EditSuggestionAuthorOrAdminOrReadOnly, ]


class TechViewsetOptions(ModelViewSet):
    serializer_class = TechnologySerializerOption
    queryset = TechnologySerializerOption.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    pagination_class = None
