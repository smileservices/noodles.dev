from .serializers import PostSerializer, PostSerializerWithReplies
from votable.viewsets import VotableVieset
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.exceptions import PermissionDenied
from rest_framework.viewsets import ModelViewSet
from notifications.tasks import create_notification
from rest_framework.decorators import action
from notifications import events as notification_events
from core.logging import logger
from django.contrib.contenttypes.models import ContentType
from core.utils import rest_paginate_queryset


class DiscussionViewset(VotableVieset):
    # this is only to be used for doing a certain post-id related action (vote, report, etc)
    serializer_class = PostSerializer
    queryset = PostSerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly]

    def list(self, request, *args, **kwargs):
        raise PermissionDenied(
            detail='Not allowed to list all discussions. Can only create using the resource discussion endpoint')

    @action(methods=['GET'], detail=True)
    def replies(self, request, *args, **kwargs):
        # shows replies
        instance = self.get_object()
        return rest_paginate_queryset(self, instance.replies.all(), PostSerializer)

    def create(self, request, *args, **kwargs):
        raise PermissionDenied(detail='Can only create using the resource discussion endpoint')

    def perform_destroy(self, instance):
        super(DiscussionViewset, self).perform_destroy(instance)
        create_notification(instance.content_object._meta.model, instance.object_id,
                            self.request.user.pk,
                            notification_events.VERB_REVIEW_REMOVE)
        logger.log_activity(f'Discussion post deleted {instance.content_object.absolute_url}')


class HasDiscussionViewsetMixin(ModelViewSet):
    # this is to be used inside the resource

    @action(methods=['GET', 'POST'], detail=True)
    def discussion_posts(self, request, *args, **kwargs):
        if request.method == 'GET':
            resource = self.get_object()
            return rest_paginate_queryset(self, resource.discussions.root_posts(), PostSerializer)
        elif request.method == 'POST':
            resource = self.get_object()
            resource_content_type = ContentType.objects.get_for_model(resource.__class__)
            post_data = {
                **self.request.data,
                **{'author_id': self.request.user.pk, 'object_id': resource.pk,
                   'content_type_id': resource_content_type.pk}
            }
            serialized_data = PostSerializer(data=self.request.data)
            serialized_data.is_valid(raise_exception=True)
            serialized_data.save(author=self.request.user, object_id=resource.pk, content_type=resource_content_type)
            create_notification(resource._meta.model, resource.pk,
                                self.request.user.pk,
                                notification_events.VERB_DISCUSSION_NEW)
            logger.log_activity(f'Discussion post created {serialized_data.instance.content_object.absolute_url}')
            return Response(status=201, data=serialized_data.data)
