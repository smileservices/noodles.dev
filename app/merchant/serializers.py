from rest_framework import serializers
from .models import MerchantModel, MerchantNoteModel
from users.serializers import UserSerializer


class MerchantNoteSerializer(serializers.ModelSerializer):
    queryset = MerchantNoteModel.objects.all()

    class Meta:
        model = MerchantNoteModel
        fields = ['id', 'date', 'content', 'is_public']


class MerchantSerializer(serializers.ModelSerializer):
    queryset = MerchantModel.objects.all()
    user = UserSerializer()
    notes = MerchantNoteSerializer(many=True)

    class Meta:
        model = MerchantModel
        fields = ['id', 'name', 'active', 'date_created', 'notes', 'user']
