from rest_framework.exceptions import PermissionDenied
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from core.logging import logger


class SubscribableVieset(ModelViewSet):

    @action(methods=['POST'], detail=True)
    def subscribe(self, request, *args, **kwargs):
        instance = self.get_object()
        is_subscribed = False
        if 'action' not in request.data:
            return Response(status=400)
        if request.data['action'] == 'check':
            subscribers, created = instance.subscribers.get_or_create()
            if created:
                subscribers.users.append(instance.author)
                subscribers.save()
            else:
                is_subscribed = request.user.pk in subscribers.users
        elif request.data['action'] == 'subscribe':
            instance.subscribe(request.user)
            is_subscribed = True
            logger.log_activity(f'User {request.user.username} subscribed to {instance.absolute_url}')
        elif request.data['action'] == 'unsubscribe':
            instance.unsubscribe(request.user)
            is_subscribed = False
            logger.log_activity(f'User {request.user.username} unsubscribed to {instance.absolute_url}')
        return Response(status=200, data={
            'subscribed': is_subscribed
        })
