from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from .serializers import PeopleSerializer
from .models import People


def AdminApp(request):
    return render(request, 'simplecrud/admin/main.html')


class PeopleAdminViewset(ModelViewSet):
    serializer_class = PeopleSerializer
    queryset = PeopleSerializer.queryset.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_fields = ['name', 'age', 'nationality']
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    search_fields = ['name', 'age', 'nationality']
    ordering_fields = ['name', 'age', 'nationality']