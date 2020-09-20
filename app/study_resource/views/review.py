from django.db import IntegrityError

from rest_framework.exceptions import PermissionDenied
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from study_resource import serializers


class ReviewVieset(ModelViewSet):
    serializer_class = serializers.ReviewSerializer
    queryset = serializers.ReviewSerializer.queryset.order_by('-created_at')
    permission_classes = [IsAuthenticatedOrReadOnly]

    def list(self, request, *args, **kwargs):
        raise PermissionDenied(detail='Not allowed to list all reviews')

    def perform_create(self, serializer):
        try:
            serializer.save(author=self.request.user)
        except IntegrityError:
            raise PermissionDenied(
                detail='You already reviewed this. Only one review per resource is allowed for any user')

    @action(methods=['POST'], detail=True)
    def vote(self, request, *args, **kwargs):
        review = self.queryset.get(id=kwargs['pk'])
        try:
            if request.data['vote'] > 0:
                review.vote_up(request.user)
            else:
                review.vote_down(request.user)
            return Response({
                'thumbs': {
                    'up': review.thumbs_up_array,
                    'down': review.thumbs_down_array,
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
