from django.shortcuts import render
from django.contrib.auth.decorators import login_required

from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from .serializers import MerchantSerializer, MerchantProfileSerializer
from .filters import MerchantFilter
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import NotFound, APIException

class MerchantViewset(ModelViewSet):
    serializer_class = MerchantSerializer
    queryset = MerchantSerializer.queryset.all()
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend, OrderingFilter, SearchFilter]
    filterset_class = MerchantFilter
    search_fields = ['name', 'user__first_name', 'user__last_name', 'user__email', 'date_created']
    ordering_fields = ['name', 'user__first_name', 'user__last_name', 'user__email', 'date_created']


class MerchantProfileViewset(ModelViewSet):
    serializer_class = MerchantProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MerchantSerializer.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        try:
            if self.get_queryset().get():
                raise APIException('Only one type of profile per user is allowed')
        except ObjectDoesNotExist:
            serializer.save(user=self.request.user)


@login_required
def profile(request):
    return render(request, 'merchant/dashboard/profile.html')