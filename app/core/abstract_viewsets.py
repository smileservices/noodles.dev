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

    def perform_destroy(self, instance):
        super(ResourceVieset, self).perform_destroy(instance)
        self.request.user.positive_score -= rewards.RESOURCE_DELETE
        self.request.user.save()


class EditSuggestionViewset(VotableVieset):
    """
    should only permit voting, editing and detail
    """
    def create(self, request, *args, **kwargs):
        return PermissionDenied('Edit suggestions are to be created through the parent resource')

    def list(self, request, *args, **kwargs):
        return PermissionDenied('Edit suggestions are to be viewed through the parent resource')
