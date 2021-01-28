import requests

from django.db import IntegrityError, models
from django.db.models import Q
from django.urls import reverse_lazy
from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from rest_framework.exceptions import PermissionDenied
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from core.abstract_viewsets import SearchableModelViewset
from . import serializers, filters
from .models import CollectionResources, Collection


def browse(request, **kwargs):
    return True


def detail(request, id, slug):
    queryset = Collection.objects
    resource = queryset.get(pk=id)
    study_resources = resource.get_study_resources()
    related = queryset.filter(
        Q(tags__in=resource.tags.all()),
        Q(technologies__in=resource.technologies.all()),
        ~Q(id=resource.id)
    ).all()[:5]
    data = {
        'result': resource,
        'study_resources': study_resources,
        'related': related,
        'urls': {
            # options
            'tag_options_api': reverse_lazy('tags-options-list'),
            'tech_options_api': reverse_lazy('techs-options-list'),
            # collections urls
            'collections_api': reverse_lazy('collection-viewset-list'),
        }
    }
    if request.user.is_authenticated:
        return render(request, 'study_collection/detail_page.html', data)
    return render(request, 'study_collection/detail_page.seo.html', data)


@login_required
def my_collections(request):
    data = {
        'urls': {
            'study_resource_options': reverse_lazy('study-resource-viewset-options'),
            'tag_options_api': reverse_lazy('tags-options-list'),
            'tech_options_api': reverse_lazy('techs-options-list'),

            'collections_api': reverse_lazy('collection-viewset-list'),
            'user_collections_list': reverse_lazy('collection-viewset-owned'),
            'update_collection_items': reverse_lazy('collection-viewset-update-collection-items'),

        }
    }
    return render(request, 'study_collection/my_collections.html', data)


class CollectionViewset(SearchableModelViewset):
    serializer_class = serializers.CollectionSerializer
    queryset = serializers.CollectionSerializer.queryset.order_by('-created_at')
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_class = filters.CollectionFilterRest

    @action(methods=['GET'], detail=False)
    def filter_public(self, request, *args, **kwargs):
        queryset = self.queryset.filter(
            items_count__gt=0,
            is_public=True
        )
        return self.filtered_response(
            request,
            ['name', 'description'],
            self.filterset_class,
            serializers.CollectionSerializerListing,
            queryset
        )

    def perform_create(self, serializer):
        serializer.save(
            author=self.request.user,
        )

    def perform_destroy(self, instance):
        if self.request.user.is_staff or instance.author == self.request.user:
            instance.delete()
        else:
            raise PermissionDenied('Only collection author or staff can delete')

    @action(methods=['GET'], detail=False)
    def owned(self, *args, **kwargs):
        # get all user collections
        queryset = self.queryset.filter(author=self.request.user.id).all().order_by('created_at')
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.serializer_class(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['GET'], detail=False)
    def owned_with_resource(self, *args, **kwargs):
        # returns all user collections and which contain the resource
        all_queryset = self.queryset.filter(author=self.request.user.id)
        selected_queryset = all_queryset.filter(resources=self.request.GET['pk'])
        all_serialized = self.serializer_class.select_options_data(all_queryset)
        selected_serialized = self.serializer_class.select_options_data(selected_queryset)
        return Response({
            'all': all_serialized.data,
            'selected': selected_serialized.data
        })

    @action(methods=['POST'], detail=False)
    def set_resource_to_collections(self, *args, **kwargs):
        # remove resource from unselected collections
        # add resource to all selected
        queryset = self.queryset.filter(author=self.request.user.id)
        resource_id = self.request.GET['pk']
        selected_collections = self.request.data['collections']
        for collection in queryset:
            if collection.pk in selected_collections:
                collection.add_resource(resource_id)
            else:
                collection.resources.remove(resource_id)
        return Response(status=200)

    @action(methods=['POST'], detail=False)
    def update_collection_items(self, *args, **kwargs):
        # endpoint for updating collection items: remove/set order
        collection = self.queryset.filter(author=self.request.user.id).values('pk').get(pk=self.request.data['pk'])
        # clean previous resources
        CollectionResources.objects.filter(
            collection=collection['pk'],
        ).delete()
        updated_resources = [CollectionResources(
            collection_id=collection['pk'],
            study_resource_id=resource['pk'],
            order=resource['order'],
        ) for resource in self.request.data['resources']]
        CollectionResources.objects.bulk_create(updated_resources)
        return Response(status=204)

    @action(methods=['GET'], detail=True)
    def resources(self, *args, **kwargs):
        # get all resources of a specific collection
        # queryset = self.queryset.get(pk=kwargs['pk']).resources.annotate(reviews_count=models.Count('reviews'))
        queryset = self.queryset.get(pk=kwargs['pk']).resources.through.objects \
            .filter(collection_id=kwargs['pk']) \
            .all() \
            .order_by('order')
        serializer = serializers.CollectionResourceListingSerializer(queryset, many=True)
        return Response(serializer.data)
