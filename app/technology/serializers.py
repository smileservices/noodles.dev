from rest_framework import serializers
from rest_framework.serializers import SerializerMethodField
from .models import Technology


class TechnologySerializer(serializers.ModelSerializer):
    queryset = Technology.objects

    class Meta:
        model = Technology
        depth = 1
        fields = ['pk', 'name', 'description', 'version', 'url', 'license', 'owner', 'pros', 'cons', 'limitations', 'ecosystem']


class TechnologySerializerOption(serializers.ModelSerializer):
    queryset = Technology.objects
    value = SerializerMethodField()
    label = SerializerMethodField()

    class Meta:
        model = Technology
        fields = ['value', 'label', 'name', 'version']

    def get_value(self, obj):
        return obj.pk

    def get_label(self, obj):
        return f'{obj.name}' if not obj.version else f'{obj.name} {obj.version}'