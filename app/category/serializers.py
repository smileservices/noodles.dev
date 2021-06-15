from rest_framework import serializers
from rest_framework.fields import SerializerMethodField
from .models import Category
from django.shortcuts import reverse


class CategorySerializer(serializers.ModelSerializer):
    queryset = Category.objects
    path = SerializerMethodField()
    url = SerializerMethodField()

    class Meta:
        model = Category
        fields = ['pk', 'name', 'description', 'description_long', 'path', 'url']

    def get_path(self, obj):
        return ' > '.join([c.name for c in obj.get_ancestors()])

    def get_url(self, obj):
        return reverse('category-detail', kwargs={'slug': obj.slug})


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
