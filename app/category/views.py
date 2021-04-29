import time
from django.http.response import JsonResponse
from .models import Category
from technology.models import Technology
from study_resource.models import StudyResource
from django.contrib.admin.utils import flatten

from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from .serializers import CategorySerializer, CategorySerializerOption


class CategoryViewset(ModelViewSet):
    serializer_class = CategorySerializer
    queryset = CategorySerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    pagination_class = None

    @action(methods=['GET'], detail=True)
    def get_technologies(self, request, *args, **kwargs):
        # get category and its ancestors
        # get all technologies related
        time_start = time.time()
        instance = self.get_object()
        instance_descendants = instance.get_descendants(include_self=True)
        techs = []
        for cat in instance_descendants.select_related():
            techs += [{
                'pk': tech.pk,
                'category': cat.name,
                'name': tech.name,
                'url': tech.absolute_url,
                'logo': tech.logo,
            } for tech in cat.related_technologies.all()]
        return JsonResponse({
            'technologies': techs,
            'time': f'{time.time()-time_start} seconds'
        })


class CategoryViewsetSelect(ModelViewSet):
    serializer_class = CategorySerializerOption
    queryset = CategorySerializerOption.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    pagination_class = None