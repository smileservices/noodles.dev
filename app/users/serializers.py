from rest_framework.serializers import ModelSerializer, CharField
from .models import CustomUser


class UserSerializer(ModelSerializer):
    queryset = CustomUser.objects.all()

    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'is_active', 'date_joined']


class UserSerializerMinimal(ModelSerializer):
    queryset = CustomUser.objects.all()
    username = CharField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'is_active']

