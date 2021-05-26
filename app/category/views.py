import time
from django.http.response import JsonResponse
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import action
from .serializers import CategorySerializer, CategorySerializerOption
from concepts.serializers_category import CategoryConceptSerializerListing, CategoryConceptSerializerOption


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
            'time': f'{time.time() - time_start} seconds'
        })

    @action(methods=['GET'], detail=True)
    def concepts(self, *args, **kwargs):
        # getting the category concepts should return concepts of all children
        instance = self.get_object()
        instance_descendants = instance.get_descendants(include_self=True)
        concepts = []
        for subcat in instance_descendants:
            concepts += [CategoryConceptSerializerListing(c).data for c in subcat.concepts.order_by('experience_level').all()]
        return Response(concepts)

    @action(methods=['GET'], detail=True)
    def higher_concepts_options(self, *args, **kwargs):
        # getting the category concepts should return concepts of all children in value/label form
        instance = self.get_object()
        instance_ancestors = instance.get_ancestors(include_self=True)
        concepts = []
        for subcat in instance_ancestors:
            concepts += [CategoryConceptSerializerOption(c).data for c in
                         subcat.concepts.order_by('experience_level').all()]
        return Response(concepts)


class CategoryViewsetSelect(ModelViewSet):
    serializer_class = CategorySerializerOption
    queryset = CategorySerializerOption.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    pagination_class = None
