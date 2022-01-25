from django.db import IntegrityError
from rest_framework.exceptions import PermissionDenied
from notifications.tasks import create_notification
from notifications import events as notification_events
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from core.logging import logger, events
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
            create_notification(serializer.instance.study_resource._meta.model, serializer.instance.study_resource.pk,
                                self.request.user.pk,
                                notification_events.VERB_REVIEW_NEW)
            logger.log_review(serializer.instance, events.OP_CREATE)
        except IntegrityError:
            raise PermissionDenied(
                detail='You already reviewed this. Only one review per resource is allowed for any user')

    def perform_destroy(self, instance):
        super(ReviewVieset, self).perform_destroy(instance)
        self.request.user.positive_score -= rewards.REVIEW_DELETE
        create_notification(instance.study_resource._meta.model, instance.study_resource.pk,
                            self.request.user.pk,
                            notification_events.VERB_REVIEW_REMOVE)
        logger.log_review(instance, events.OP_DELETE)
