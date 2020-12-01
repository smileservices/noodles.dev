from votable.viewsets import VotableVieset
from app.settings import rewards
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied


class ResourceVieset(VotableVieset):
    m2m_fields = None

    def perform_create(self, serializer):
        resource = serializer.save(author=self.request.user)
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
            return super(ResourceVieset, self).update(request, *args, **kwargs)
        else:
            raise PermissionDenied('Only staff or resource owner can update the resource.'
                                   ' Create an edit suggestion instead.')

    def perform_destroy(self, instance):
        if self.request.user.is_staff or instance.author == self.request.user:
            return super(ResourceVieset, self).perform_destroy(instance)
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
