import requests
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from tag import serializers


class TagViewset(ModelViewSet):
    serializer_class = serializers.TagSerializer
    queryset = serializers.TagSerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    pagination_class = None


class TagViewsetSelect(ModelViewSet):
    serializer_class = serializers.TagSerializerOption
    queryset = serializers.TagSerializerOption.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    pagination_class = None
