import requests
import json
from django.db import IntegrityError, models
from django.db.models import Q
from django.urls import reverse_lazy
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from core.abstract_viewsets import ResourceWithEditSuggestionVieset
from . import serializers, filters
from .models import CollectionResources, Collection
from django.views.decorators.cache import cache_page

@cache_page(60 * 60 * 2)
def detail(request, id, slug):
    queryset = Collection.objects
    resource = queryset.get(pk=id)
    study_resources = resource.get_study_resources()
    data = {
        'result': resource,
        'study_resources': study_resources,
        'thumbs_up_array': json.dumps(resource.thumbs_up_array),
        'thumbs_down_array': json.dumps(resource.thumbs_down_array),
        'urls': {
            # options
            'tag_options_api': reverse_lazy('tags-options-list'),
            'tech_options_api': reverse_lazy('techs-options-list'),
            # collections urls
            'collections_api': reverse_lazy('collection-viewset-list'),
            'vote_url': reverse_lazy('collection-viewset-vote', kwargs={'pk': resource.pk}),
        }
    }
    return render(request, 'study_collection/detail_page.html', data)


def list_all(request):
    queryset = Collection.objects.all()
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
    return render(request, 'study_collection/list_page_seo.html', data)


class CollectionViewset(ResourceWithEditSuggestionVieset):
    serializer_class = serializers.CollectionSerializer
    queryset = serializers.CollectionSerializer.queryset.order_by('-created_at')
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_class = filters.CollectionFilterRest

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


# todo
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
