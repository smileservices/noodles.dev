import time
from django.http.response import JsonResponse
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from core.utils import rest_paginate_queryset
from notifications.viewsets import SubscribableVieset
from technology.models import Technology
from .serializers import CategorySerializer, CategorySerializerOption
from concepts.serializers_category import CategoryConceptSerializerListing, CategoryConceptSerializerOption
from study_resource.models import StudyResource
from django.urls import reverse_lazy
from discussions.views import HasDiscussionViewsetMixin
from . import models


def detail(request, slug):
    queryset = models.Category.objects
    detail = queryset.get(slug=slug)
    instance_descendants = detail.get_descendants(include_self=True)
    resources = []
    techs = []
    for cat in instance_descendants.prefetch_related('resources', 'related_technologies'):
        techs += cat.related_technologies.all()
        # resources += cat.resources.filter(status=StudyResource.StatusOptions.APPROVED).all()
    data = {
        'detail': detail,
        'concepts': detail.concepts.all(),
        'technologies': techs,
        'resources': detail.resources.filter(status=StudyResource.StatusOptions.APPROVED).all(),
        'subscribe_url': reverse_lazy('categories-viewset-subscribe', kwargs={'pk': detail.pk}),
    }
    return render(request, 'category/detail_page.html', data)


class CategoryViewset(SubscribableVieset, HasDiscussionViewsetMixin):
    serializer_class = CategorySerializer
    queryset = CategorySerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]

    @action(methods=['GET'], detail=True)
    def get_technologies(self, request, *args, **kwargs):
        # get category and its ancestors
        # get all technologies related
        time_start = time.time()
        instance = self.get_object()
        instance_descendants = instance.get_descendants(include_self=True)
        techs = []
        for cat in instance_descendants.select_related():
            techs += [{
                'pk': tech.pk,
                'category': cat.name,
                'name': tech.name,
                'url': tech.absolute_url,
                'logo': tech.logo,
            } for tech in cat.related_technologies.all()]
        return JsonResponse({
            'technologies': techs,
            'time': f'{time.time() - time_start} seconds'
        })

    @action(methods=['GET'], detail=True)
    def concepts(self, *args, **kwargs):
        # getting the category concepts should return concepts of all children
        instance = self.get_object()
        instance_descendants = instance.get_descendants(include_self=True)
        concepts = []
        for subcat in instance_descendants:
            concepts += [CategoryConceptSerializerListing(c).data for c in
                         subcat.concepts.order_by('experience_level').all()]
        return Response(concepts)

    @action(methods=['GET'], detail=True)
    def higher_concepts_options(self, *args, **kwargs):
        # getting the category concepts should return concepts of all children in value/label form
        instance = self.get_object()
        instance_ancestors = instance.get_ancestors(include_self=True)
        concepts = []
        for subcat in instance_ancestors:
            concepts += [CategoryConceptSerializerOption(c).data for c in
                         subcat.concepts.order_by('experience_level').all()]
        return Response(concepts)

    @action(methods=['GET'], detail=True)
    def technology_higher_concepts_options(self, *args, **kwargs):
        # we are getting the category concepts of a technology. first get the technology then the category, only then the concepts
        # getting the category concepts should return concepts of all children in value/label form
        categories = Technology.objects.get(pk=kwargs['pk']).category.all()
        concepts = []
        for categ in categories:
            for subcat in categ.get_ancestors(include_self=True):
                concepts += [CategoryConceptSerializerOption(c).data for c in
                             subcat.concepts.order_by('experience_level').all()]
        return Response(concepts)

    @action(methods=['GET'], detail=False)
    def featured(self, request, *args, **kwargs):
        queryset = self.queryset.filter()
        return rest_paginate_queryset(self, queryset)


class CategoryViewsetSelect(ModelViewSet):
    serializer_class = CategorySerializerOption
    queryset = CategorySerializerOption.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    pagination_class = None
