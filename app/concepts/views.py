from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from category.serializers import CategorySerializerOption
from technology.models import Technology
from technology.serializers import TechnologySerializerOption
from . import serializers_category
from . import serializers_technology
from django.http.response import Http404
from . import models
from core.abstract_viewsets import ResourceWithEditSuggestionVieset, EditSuggestionViewset
from core.permissions import EditSuggestionAuthorOrAdminOrReadOnly
from core.utils import rest_paginate_queryset
from app.settings import rewards
from .serializers_category import CategoryConceptSerializerOption
import json
from . import models
from django.shortcuts import get_object_or_404
from study_resource.models import StudyResource


class ConceptCategoryViewset(ResourceWithEditSuggestionVieset):
    serializer_class = serializers_category.CategoryConceptSerializer
    queryset = serializers_category.CategoryConceptSerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    filterset_fields = ['category']

    @action(methods=['GET'], detail=False)
    def options(self, request, *args, **kwargs):
        return Response({
            'experience_level': [{'value': c[0], 'label': c[1]} for c in
                                 models.CategoryConcept.ExperienceLevel.choices],
            'concepts': [CategoryConceptSerializerOption(c).data for c in models.CategoryConcept.objects.all()]
        })

    @action(methods=['GET'], detail=False)
    def featured(self, request, *args, **kwargs):
        queryset = self.queryset
        return rest_paginate_queryset(self, queryset)


class CategoryConceptEditSuggestionViewset(EditSuggestionViewset):
    serializer_class = serializers_category.CategoryConceptEditSuggestionSerializer
    queryset = serializers_category.CategoryConceptEditSuggestionSerializer.queryset
    permission_classes = [EditSuggestionAuthorOrAdminOrReadOnly, ]


class ConceptTechnologyViewset(ResourceWithEditSuggestionVieset):
    serializer_class = serializers_technology.TechnologyConceptSerializer
    queryset = serializers_technology.TechnologyConceptSerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]

    @action(methods=['GET'], detail=False)
    def options(self, request, *args, **kwargs):
        return Response({
            'experience_level': [{'value': c[0], 'label': c[1]} for c in
                                 models.TechnologyConcept.ExperienceLevel.choices],
            'technologies': [TechnologySerializerOption(t).data for t in Technology.objects.all()]
        })


class TechnologyConceptEditSuggestionViewset(EditSuggestionViewset):
    serializer_class = serializers_technology.TechnologyConceptEditSuggestionSerializer
    queryset = serializers_technology.TechnologyConceptEditSuggestionSerializer.queryset
    permission_classes = [EditSuggestionAuthorOrAdminOrReadOnly, ]


def category_detail(request, slug):
    queryset = models.CategoryConcept.objects
    try:
        detail = queryset.prefetch_related('technology_concepts', 'children', 'related_resources').get(slug=slug)
    except queryset.model.DoesNotExist:
        raise Http404()
    data = {
        'detail': detail,
        'technology_concepts': detail.technology_concepts.all(),
        'children_concepts': detail.children.all(),
        'resources': detail.related_resources.filter(status=StudyResource.StatusOptions.APPROVED).all(),
        'vote_url': reverse_lazy('concept-category-viewset-vote', kwargs={'pk': detail.pk}),
        'subscribe_url': reverse_lazy('concept-category-viewset-subscribe', kwargs={'pk': detail.pk}),
    }
    return render(request, 'concepts/category/detail_page.html', data)


@login_required
def category_edit(request, id):
    data = {
        'urls': {
            'resource_detail': reverse_lazy('concept-category-viewset-detail', kwargs={'pk': id}),
            'edit_suggestions_list': reverse_lazy('concept-category-viewset-edit-suggestions', kwargs={'pk': id}),
            'edit_suggestions_publish': reverse_lazy('concept-category-viewset-edit-suggestion-publish',
                                                     kwargs={'pk': id}),
            'edit_suggestions_reject': reverse_lazy('concept-category-viewset-edit-suggestion-reject',
                                                    kwargs={'pk': id}),
            'edit_suggestions_api': reverse_lazy('concept-category-edit-suggestions-viewset-list'),
            'resource_api': reverse_lazy('concept-category-viewset-list'),
            'categories_options_api': reverse_lazy('categories-options-list'),
        }
    }
    return render(request, 'concepts/category/edit_page.html', data)


@login_required
def category_create(request):
    preselected_category = 'false'
    preselected_parent = 'false'
    if 'category' in request.GET:
        category = models.Category.objects.get(pk=request.GET['category'])
        preselected_category = json.dumps(CategorySerializerOption(category).data)
    if 'parent' in request.GET:
        concept = models.CategoryConcept.objects.get(pk=request.GET['parent'])
        preselected_parent = json.dumps(CategoryConceptSerializerOption(concept).data)
    data = {
        'data': {
            'reward': rewards.RESOURCE_CREATE,
            'preselected_category': preselected_category,
            'preselected_parent': preselected_parent
        },
        'urls': {
            'concept_category_api': reverse_lazy('concept-category-viewset-list'),
            'categories_options_api': reverse_lazy('categories-options-list'),
        }
    }

    return render(request, 'concepts/category/create_page.html', data)


def technology_detail(request, slug):
    queryset = models.TechnologyConcept.objects
    try:
        detail = queryset.select_related().get(slug=slug)
    except queryset.model.DoesNotExist:
        raise Http404()
    data = {
        'detail': detail,
        'resources': detail.related_resources.filter(status=StudyResource.StatusOptions.APPROVED).all(),
        'vote_url': reverse_lazy('concept-technology-viewset-vote', kwargs={'pk': detail.pk}),
        'subscribe_url': reverse_lazy('concept-technology-viewset-subscribe', kwargs={'pk': detail.pk}),
    }
    return render(request, 'concepts/technology/detail_page.html', data)


@login_required
def technology_edit(request, id):
    data = {
        'urls': {
            'resource_detail': reverse_lazy('concept-technology-viewset-detail', kwargs={'pk': id}),
            'edit_suggestions_list': reverse_lazy('concept-technology-viewset-edit-suggestions', kwargs={'pk': id}),
            'edit_suggestions_publish': reverse_lazy('concept-technology-viewset-edit-suggestion-publish',
                                                     kwargs={'pk': id}),
            'edit_suggestions_reject': reverse_lazy('concept-technology-viewset-edit-suggestion-reject',
                                                    kwargs={'pk': id}),
            'edit_suggestions_api': reverse_lazy('concept-technology-edit-suggestions-viewset-list'),
            'resource_api': reverse_lazy('concept-technology-viewset-list'),
            'categories_options_api': reverse_lazy('categories-options-list'),
        }
    }
    return render(request, 'concepts/technology/edit_page.html', data)


@login_required
def technology_create(request):
    preselected_technology = 'false'
    if 'technology' in request.GET:
        tech = Technology.objects.get(pk=request.GET['technology'])
        preselected_technology = json.dumps(TechnologySerializerOption(tech).data)
    data = {
        'data': {
            'reward': rewards.RESOURCE_CREATE,
            'preselected_technology': preselected_technology
        },
        'urls': {
            'concept_category_api': reverse_lazy('concept-technology-viewset-list'),
            'categories_options_api': reverse_lazy('categories-options-list'),
        }
    }

    return render(request, 'concepts/technology/create_page.html', data)


def category_history(request, slug):
    instance = get_object_or_404(models.CategoryConcept, slug=slug)
    data = {
        'instance': instance,
        'data': {
            'title': f'History of {instance.name} Concept',
            'breadcrumbs': f'<a href="/">Homepage</a> / Resource <a href="{instance.absolute_url}">{instance.name}</a>',
        },
        'urls': {
            'history_get': reverse_lazy('concept-category-viewset-history', kwargs={'pk': instance.pk}),
        }
    }
    return render(request, 'history/history_page.html', data)


def technology_history(request, slug):
    instance = get_object_or_404(models.TechnologyConcept, slug=slug)
    data = {
        'instance': instance,
        'data': {
            'title': f'History of {instance.name} Implementation Concept',
            'breadcrumbs': f'<a href="/">Homepage</a> / Resource <a href="{instance.absolute_url}">{instance.name}</a>',
        },
        'urls': {
            'history_get': reverse_lazy('concept-technology-viewset-history', kwargs={'pk': instance.pk}),
        }
    }
    return render(request, 'history/history_page.html', data)


def list_all_category(request):
    queryset = models.CategoryConcept.objects.all()
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
    return render(request, 'concepts/category/list_page_seo.html', data)


def list_all_technology(request):
    queryset = models.TechnologyConcept.objects.all()
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
    return render(request, 'concepts/technology/list_page_seo.html', data)
