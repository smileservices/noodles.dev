import requests
import json
from django.shortcuts import render
from django.http.response import JsonResponse, Http404
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db import models
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
from .serializers import TechnologySerializer, TechnologySerializerOption, TechnologyMinimal
from .models import Technology
from django.views.decorators.cache import cache_page
from app.settings import rewards
from django.shortcuts import get_object_or_404
from core.utils import rest_paginate_queryset
from discussions.views import HasDiscussionViewsetMixin

def detail(request, slug):
    queryset = Technology.objects
    try:
        detail = queryset.prefetch_related('related_technologies', 'studyresourcetechnology_set').get(slug=slug)
    except Technology.DoesNotExist:
        return Http404()
    resources_ids = [tech['study_resource_id'] for tech in
                     detail.studyresourcetechnology_set.values('study_resource_id').all()]
    data = {
        'detail': detail,
        'concepts': detail.concepts.order_by('experience_level').all(),
        'collections': detail.collections.order_by('created_at').select_related().all(),
        'related_technologies': detail.related_technologies.all(),
        'resources': StudyResource.objects.filter(
            pk__in=resources_ids).order_by_rating_then_publishing_date().select_related(),
        'thumbs_up_array': json.dumps(detail.thumbs_up_array),
        'thumbs_down_array': json.dumps(detail.thumbs_down_array),
        'vote_url': reverse_lazy('techs-viewset-vote', kwargs={'pk': detail.pk}),
        'subscribe_url': reverse_lazy('techs-viewset-subscribe', kwargs={'pk': detail.pk}),
    }
    return render(request, 'technology/detail_page.html', data)


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


def history(request, slug):
    instance = get_object_or_404(Technology, slug=slug)
    data = {
        'instance': instance,
        'data': {
            'title': f'History of {instance.name} Technology',
            'breadcrumbs': f'<a href="/">Homepage</a> / Technology <a href="{instance.absolute_url}">{instance.name}</a>',
        },
        'urls': {
            'history_get': reverse_lazy('techs-viewset-history', kwargs={'pk': instance.pk}),
        }
    }
    return render(request, 'history/history_page.html', data)


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


class TechViewset(ResourceWithEditSuggestionVieset, HasDiscussionViewsetMixin):
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

    @action(methods=['GET'], detail=False)
    def featured(self, request, *args, **kwargs):
        queryset = self.queryset.filter(featured=True)
        return rest_paginate_queryset(self, queryset)

    @action(methods=['GET'], detail=False)
    def no_technology_concept(self, request, *args, **kwargs):
        queryset = self.queryset.annotate(concepts_count=models.Count('concepts')).order_by('concepts_count')
        return rest_paginate_queryset(self, queryset)

    @action(methods=['GET'], detail=False)
    def no_resources(self, request, *args, **kwargs):
        queryset = self.queryset.annotate(resources_count=models.Count('resources')).order_by('resources_count')
        self.serializer_class = TechnologyMinimal
        return rest_paginate_queryset(self, queryset)


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
