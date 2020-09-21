import requests
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from study_resource import serializers


class TechViewset(ModelViewSet):
    serializer_class = serializers.TechnologySerializer
    queryset = serializers.TechnologySerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    pagination_class = None

    @action(methods=['POST'], detail=False)
    def validate_url(self, request, *args, **kwargs):
        try:
            url_request = requests.get(request.data['url'])
            if url_request.status_code != 200:
                return Response({
                    'error': True,
                    'message': 'The url is not giving a valid response. Please check it again.'
                })
        except Exception as e:
            return Response({
                'error': True,
                'message': str(e)
            })
        return Response({
            'error': False
        })