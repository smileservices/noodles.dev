from rest_framework import serializers
from rest_framework.fields import SerializerMethodField
from .models import Category


class CategorySerializer(serializers.ModelSerializer):
    queryset = Category.objects
    path = SerializerMethodField()

    class Meta:
        model = Category
        fields = ['pk', 'name', 'description', 'path']

    def get_path(self, obj):
        return ' > '.join([c.name for c in obj.get_ancestors()])


class CategorySerializerOption(serializers.ModelSerializer):
    queryset = Category.objects
    label = SerializerMethodField()
    value = SerializerMethodField()

    class Meta:
        model = Category
        fields = ['value', 'label']

    def get_label(self, obj):
        return obj.name_tree

    def get_value(self, obj):
        return obj.pk
