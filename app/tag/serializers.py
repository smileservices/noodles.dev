from rest_framework import serializers
from .models import Tag


class TagSerializer(serializers.ModelSerializer):
    queryset = Tag.objects

    class Meta:
        model = Tag
        fields = ['pk', 'name', 'description']