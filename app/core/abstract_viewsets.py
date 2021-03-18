from votable.viewsets import VotableVieset
from django_edit_suggestion.rest_views import ModelViewsetWithEditSuggestion
from app.settings import rewards
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from core.status import HTTP_209_EDIT_SUGGESTION_CREATED
from rest_framework.viewsets import ModelViewSet


class SearchableModelViewset(ModelViewSet):

    def filtered_response(self, request, search_fields, filterset_class, listing_serializer, queryset):
        if 'search' in request.GET:
            queryset = queryset.search_similar(search_fields, request.GET['search'], 0.1)
        else:
            queryset = queryset
        filtered_queryset = filterset_class(request.GET, queryset)
        # queryset = self.queryset.search_match(request.GET['term'], 0.01)
        page = self.paginate_queryset(filtered_queryset.qs)
        if page is not None:
            serializer = listing_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = listing_serializer(filtered_queryset, many=True)
        return Response(serializer.data)


class ResourceWithEditSuggestionVieset(ModelViewsetWithEditSuggestion, VotableVieset):
    m2m_fields = None

    def perform_create(self, serializer):
        resource = serializer.save(author=self.request.user)
        self.request.user.positive_score += rewards.RESOURCE_CREATE
        self.request.user.save()
        return resource

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if self.request.user.is_staff or instance.author == self.request.user:
            return super(ResourceWithEditSuggestionVieset, self).update(request, *args, **kwargs)
        else:
            serialized_data = self.get_serializer(data=request.data)
            validated_data = serialized_data.run_validation(request.data)
            edsug = self.edit_suggestion_perform_create(instance, validated_data)
            serializer = self.serializer_class.get_edit_suggestion_serializer()
            return Response(serializer(edsug).data, status=HTTP_209_EDIT_SUGGESTION_CREATED)

    def perform_destroy(self, instance):
        if self.request.user.is_staff or instance.author == self.request.user:
            return super(ResourceWithEditSuggestionVieset, self).perform_destroy(instance)
        else:
            raise PermissionDenied('Only staff or resource owner can delete the resource.')


class EditSuggestionViewset(VotableVieset):
    """
    should only permit voting, editing and detail
    """

    def create(self, request, *args, **kwargs):
        raise PermissionDenied('Edit suggestions are to be created through the parent resource.')

    def list(self, request, *args, **kwargs):
        return PermissionDenied('Edit suggestions are to be viewed through the parent resource.')

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if self.request.user.is_staff or instance.edit_suggestion_author == self.request.user:
            return super(EditSuggestionViewset, self).update(request, *args, **kwargs)
        else:
            raise PermissionDenied('Only staff or resource owner can update the edit suggestion.')

    def perform_destroy(self, instance):
        if self.request.user.is_staff or instance.edit_suggestion_author == self.request.user:
            return super(EditSuggestionViewset, self).perform_destroy(instance)
        else:
            raise PermissionDenied('Only staff or resource owner can delete the edit suggestion.')
