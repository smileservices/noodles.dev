from django.shortcuts import render
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from . import serializers_category
from . import serializers_technology
from . import models
from core.abstract_viewsets import ResourceWithEditSuggestionVieset


class ConceptCategoryViewset(ResourceWithEditSuggestionVieset):
    serializer_class = serializers_category.CategoryConceptSerializer
    queryset = serializers_category.CategoryConceptSerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    filterset_fields = ['category']


class ConceptTechnologyViewset(ResourceWithEditSuggestionVieset):
    serializer_class = serializers_technology.TechnologyConceptSerializer
    queryset = serializers_technology.TechnologyConceptSerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]


def category_detail(request, id, slug):
    queryset = models.CategoryConcept.objects
    detail = queryset.select_related().get(pk=id)

    return None


def technology_detail(request, id, slug):
    queryset = models.TechnologyConcept.objects
    detail = queryset.select_related().get(pk=id)

    return None
