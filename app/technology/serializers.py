from rest_framework import serializers
from .models import Technology


class TechnologySerializer(serializers.ModelSerializer):
    queryset = Technology.objects

    class Meta:
        model = Technology
        depth = 1
        fields = ['pk', 'name', 'description', 'version', 'url', 'license', 'owner', 'pros', 'cons', 'limitations', 'ecosystem']


class TechnologySerializerShort(serializers.ModelSerializer):
    queryset = Technology.objects

    class Meta:
        model = Technology
        fields = ['pk', 'name', 'version']
