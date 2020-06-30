from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser
from .serializers import PeopleSerializer
from .models import People


def AdminApp(request):
    return render(request, 'simplecrud/admin/main.html')


class PeopleAdminViewset(ModelViewSet):
    serializer_class = PeopleSerializer
    queryset = PeopleSerializer.queryset.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
