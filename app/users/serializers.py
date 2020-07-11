from rest_framework.serializers import ModelSerializer
from .models import CustomUser


class UserSerializer(ModelSerializer):
    queryset = CustomUser.objects.all()

    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'is_active', 'date_joined']
