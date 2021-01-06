from votable.viewsets import VotableVieset
from django_edit_suggestion.rest_views import ModelViewsetWithEditSuggestion
from app.settings import rewards
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework import status
from core.status import HTTP_209_EDIT_SUGGESTION_CREATED


class ResourceWithEditSuggestionVieset(ModelViewsetWithEditSuggestion, VotableVieset):
    m2m_fields = None

    def perform_create(self, serializer):
        resource = serializer.save(author=self.request.user)
        # todo we should handle m2m in serializer.run_validation, don't need this here
        if self.m2m_fields:
            for m2m_field in self.m2m_fields:
                if m2m_field in self.request.data:
                    getattr(resource, m2m_field).add(*self.request.data[m2m_field])
        self.request.user.positive_score += rewards.RESOURCE_CREATE
        self.request.user.save()
        return resource

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if self.request.user.is_staff or instance.author == self.request.user:
            return super(ResourceWithEditSuggestionVieset, self).update(request, *args, **kwargs)
        else:
            edsug = self.edit_suggestion_perform_create(instance)
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
