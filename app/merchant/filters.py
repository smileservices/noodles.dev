from django_filters import rest_framework as filters
from .models import MerchantModel


class MerchantFilter(filters.FilterSet):
    date_created = filters.DateTimeFromToRangeFilter()

    class Meta:
        model = MerchantModel
        fields = ['name', 'user__first_name', 'user__last_name', 'user__email', 'active', 'date_created']
