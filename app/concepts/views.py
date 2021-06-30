from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from category.serializers import CategorySerializerOption
from technology.models import Technology
from technology.serializers import TechnologySerializerOption
from . import serializers_category
from . import serializers_technology
from . import models
from core.abstract_viewsets import ResourceWithEditSuggestionVieset, EditSuggestionViewset
from core.permissions import EditSuggestionAuthorOrAdminOrReadOnly
from app.settings import rewards
from .serializers_category import CategoryConceptSerializerOption
import json


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
    detail = queryset.select_related().get(slug=slug)
    data = {
        'result': detail,
        'technology_concepts': detail.technology_concepts.all(),
        'children_concepts': detail.children.all(),
        'vote_url': reverse_lazy('concept-category-viewset-vote', kwargs={'pk': id})
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
    detail = queryset.select_related().get(slug=slug)
    data = {
        'result': detail,
        'vote_url': reverse_lazy('concept-technology-viewset-vote', kwargs={'pk': id})
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
