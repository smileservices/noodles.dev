from rest_framework import serializers
from rest_framework.fields import SerializerMethodField
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    queryset = Category.objects

    class Meta:
        model = Category
        fields = ['pk', 'name', 'description']


class CategorySerializerOption(serializers.ModelSerializer):
    queryset = Category.objects
    label = SerializerMethodField()
    value = SerializerMethodField()

    class Meta:
        model = Category
        fields = ['value', 'label']

    def get_label(self, obj):
        return obj.name

    def get_value(self, obj):
        return obj.pk
