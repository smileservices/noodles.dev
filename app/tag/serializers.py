from rest_framework import serializers
from rest_framework.fields import SerializerMethodField
from .models import Tag


class TagSerializer(serializers.ModelSerializer):
    queryset = Tag.objects

    class Meta:
        model = Tag
        fields = ['pk', 'name', 'description']


class TagSerializerOption(serializers.ModelSerializer):
    queryset = Tag.objects
    label = SerializerMethodField()
    value = SerializerMethodField()

    class Meta:
        model = Tag
        fields = ['value', 'label']

    def get_label(self, obj):
        return obj.name

    def get_value(self, obj):
        return obj.pk
