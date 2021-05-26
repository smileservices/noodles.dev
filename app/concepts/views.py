from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from . import serializers_category
from . import serializers_technology
from . import models
from core.abstract_viewsets import ResourceWithEditSuggestionVieset, EditSuggestionViewset
from core.permissions import EditSuggestionAuthorOrAdminOrReadOnly


class ConceptCategoryViewset(ResourceWithEditSuggestionVieset):
    serializer_class = serializers_category.CategoryConceptSerializer
    queryset = serializers_category.CategoryConceptSerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    filterset_fields = ['category']

    @action(methods=['GET'], detail=False)
    def options(self, request, *args, **kwargs):
        return Response({
            'experience_level': [{'value': c[0], 'label': c[1]} for c in models.CategoryConcept.ExperienceLevel.choices]
        })


class CategoryConceptEditSuggestionViewset(EditSuggestionViewset):
    serializer_class = serializers_category.CategoryConceptEditSuggestionSerializer
    queryset = serializers_category.CategoryConceptEditSuggestionSerializer.queryset
    permission_classes = [EditSuggestionAuthorOrAdminOrReadOnly, ]


class ConceptTechnologyViewset(ResourceWithEditSuggestionVieset):
    serializer_class = serializers_technology.TechnologyConceptSerializer
    queryset = serializers_technology.TechnologyConceptSerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]


def category_detail(request, id, slug):
    queryset = models.CategoryConcept.objects
    detail = queryset.select_related().get(pk=id)
    data = {
        'result': detail,
    }
    return render(request, 'concepts/category/detail_page_seo.html', data)


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


def technology_detail(request, id, slug):
    queryset = models.TechnologyConcept.objects
    detail = queryset.select_related().get(pk=id)

    return None
