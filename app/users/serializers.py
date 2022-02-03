from rest_framework.serializers import ModelSerializer, CharField
from .models import CustomUser


class UserSerializer(ModelSerializer):
    queryset = CustomUser.objects.all()

    class Meta:
        model = CustomUser
        fields = ['pk', 'first_name', 'last_name', 'username', 'email', 'is_active', 'date_joined']


class UserSerializerMinimal(ModelSerializer):
    queryset = CustomUser.objects.all()
    username = CharField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ['pk', 'username', 'is_active', 'about', 'first_name', 'last_name', 'profile_url', 'community_score']

