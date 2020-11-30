from django.db import IntegrityError
from rest_framework.exceptions import PermissionDenied
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from votable.viewsets import VotableVieset
from study_resource import serializers
from app.settings import rewards

class ReviewVieset(VotableVieset):
    serializer_class = serializers.ReviewSerializer
    queryset = serializers.ReviewSerializer.queryset.order_by('-created_at')
    permission_classes = [IsAuthenticatedOrReadOnly]

    def list(self, request, *args, **kwargs):
        raise PermissionDenied(detail='Not allowed to list all reviews')

    def perform_create(self, serializer):
        try:
            serializer.save(author=self.request.user)
            self.request.user.positive_score += rewards.REVIEW_CREATE
        except IntegrityError:
            raise PermissionDenied(
                detail='You already reviewed this. Only one review per resource is allowed for any user')

    def perform_destroy(self, instance):
        super(ReviewVieset, self).perform_destroy(instance)
        self.request.user.positive_score -= rewards.REVIEW_DELETE
