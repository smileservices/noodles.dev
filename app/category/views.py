import requests
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .serializers import CategorySerializer, CategorySerializerOption


class CategoryViewset(ModelViewSet):
    serializer_class = CategorySerializer
    queryset = CategorySerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    pagination_class = None


class CategoryViewsetSelect(ModelViewSet):
    serializer_class = CategorySerializerOption
    queryset = CategorySerializerOption.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    pagination_class = None
