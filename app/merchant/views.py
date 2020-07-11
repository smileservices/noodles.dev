from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAdminUser
from .serializers import MerchantSerializer
from .filters import MerchantFilter


class MerchantViewset(ModelViewSet):
    serializer_class = MerchantSerializer
    queryset = MerchantSerializer.queryset.all()
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = MerchantFilter
    search_fields = ['name', 'user__first_name', 'user__last_name', 'user__email', 'date_created']
    ordering_fields = ['name', 'user__first_name', 'user__last_name', 'user__email', 'date_created']
