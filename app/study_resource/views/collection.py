import requests

from django.db import IntegrityError, models

from rest_framework.exceptions import PermissionDenied
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from study_resource import serializers
from study_resource.models import CollectionResources


class CollectionViewset(ModelViewSet):
    serializer_class = serializers.CollectionSerializer
    queryset = serializers.CollectionSerializer.queryset.order_by('-created_at')
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(
            owner=self.request.user,
        )

    @action(methods=['GET'], detail=False)
    def owned(self, *args, **kwargs):
        queryset = self.queryset.filter(owner=self.request.user.id)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.serializer_class(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['GET'], detail=False)
    def owned_resource(self, *args, **kwargs):
        # returns all user collections and which ones contain the resource
        all_queryset = self.queryset.filter(owner=self.request.user.id)
        selected_queryset = all_queryset.filter(resources=self.request.GET['pk'])
        all_serialized = self.serializer_class(all_queryset, many=True)
        selected_serialized = self.serializer_class(selected_queryset, many=True)
        return Response({
            'all': all_serialized.data,
            'selected': selected_serialized.data
        })

    @action(methods=['POST'], detail=False)
    def set_items(self, *args, **kwargs):
        # remove resource from unselected collections
        # add resource to all selected
        queryset = self.queryset.filter(owner=self.request.user.id)
        resource_id = self.request.GET['pk']
        selected_collections = self.request.data['collections']
        for collection in queryset:
            if collection.pk in selected_collections:
                collection.resources.add(resource_id)
            else:
                collection.resources.remove(resource_id)
        return Response(status=200)

    @action(methods=['POST'], detail=False)
    def update_collection_items(self, *args, **kwargs):
        collection = self.queryset.filter(owner=self.request.user.id).values('pk').get(pk=self.request.data['pk'])
        # clean previous resources
        CollectionResources.objects.filter(
            collection=collection['pk'],
            study_resource_id__in=self.request.data['remove']
        ).delete()
        # todo handle update
        # updated_resources = [CollectionResources(
        #     collection_id=collection.pk,
        #     study_resource_id=resource['pk'],
        #     order=resource['order'],
        # ) for resource in self.request.data['resources']]
        # CollectionResources.objects.bulk_create(updated_resources)
        return Response(status=204)

    @action(methods=['GET'], detail=True)
    def resources(self, *args, **kwargs):
        queryset = self.queryset.get(pk=kwargs['pk']).resources.annotate(reviews_count=models.Count('reviews'))
        page = self.paginate_queryset(queryset.all())
        if page is not None:
            serializer = serializers.StudyResourceSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = serializers.StudyResourceSerializer(queryset, many=True)
        return Response(serializer.data)
