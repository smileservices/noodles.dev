from rest_framework.serializers import ModelSerializer, CharField
from .models import CustomUser


class UserSerializer(ModelSerializer):
    queryset = CustomUser.objects.all()

    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'is_active', 'date_joined']


class UserSerializerMinimal(ModelSerializer):
    queryset = CustomUser.objects.all()
    get_full_name = CharField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'get_full_name', 'is_active']

