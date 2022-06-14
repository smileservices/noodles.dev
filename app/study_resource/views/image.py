from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from study_resource.serializers import ImageSerializer, InternalImageSerializer


class StudyImageViewset(ModelViewSet):
    serializer_class = ImageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, ]

    def get_queryset(self):
        # make sure that the user is the owner of resource
        return ImageSerializer.queryset.filter(study_resource__author=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        if not request.data['image_file']:
            del request.data['image_file']
        return super().create(request, *args, **kwargs)

class InternalStudyImageViewset(ModelViewSet):
    serializer_class = InternalImageSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, ]

    def get_queryset(self):
        # make sure that the user is the owner of resource
        return InternalImageSerializer.queryset.filter(study_resource__author=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        if not request.data['image_file']:
            del request.data['image_file']
        return super().create(request, *args, **kwargs)

