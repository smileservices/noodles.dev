from rest_framework.exceptions import PermissionDenied
from django.db import IntegrityError
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from core.logging import  logger

class VotableVieset(ModelViewSet):

    @action(methods=['POST'], detail=True)
    def vote(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            if request.data['vote'] > 0:
                instance.vote_up(request.user)
            else:
                instance.vote_down(request.user)
            logger.log_vote(instance, request.data['vote'], request.user)
            return Response({
                'thumbs': {
                    'up': instance.thumbs_up_array,
                    'down': instance.thumbs_down_array,
                },
                'vote': request.data['vote'],
                'result': 'Thank you for voting'
            })
        except Exception as e:
            return Response(
                status=403,
                data={
                    'error': e
                })
