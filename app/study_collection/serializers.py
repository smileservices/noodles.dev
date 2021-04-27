from rest_framework import serializers
from rest_framework.fields import FloatField, IntegerField

from study_resource.models import StudyResource
from study_resource.serializers import StudyResourceListingMinimalSerializer
from users.serializers import UserSerializerMinimal
from tag.serializers import TagSerializerOption
from tag.models import Tag
from technology.serializers import TechnologySerializerOption

from .models import Collection


class CollectionSelectOptionSerializer(serializers.ModelSerializer):
    queryset = Collection.objects
    value = serializers.SerializerMethodField()
    label = serializers.SerializerMethodField()

    class Meta:
        model = Collection
        fields = ['value', 'label']

    def get_value(self, obj):
        return obj.pk

    def get_label(self, obj):
        return obj.name


class CollectionSerializer(serializers.ModelSerializer):
    queryset = Collection.objects
    author = UserSerializerMinimal(many=False, read_only=True)
    tags = TagSerializerOption(many=True, read_only=True)
    technologies = TechnologySerializerOption(many=True, read_only=True)
    items_count = IntegerField(read_only=True)

    class Meta:
        model = Collection
        fields = [
            'pk', 'name', 'description', 'created_at', 'author', 'tags', 'technologies', 'items_count', 'is_public',
            'thumbs_up', 'thumbs_down',
        ]

    def run_validation(self, data):
        validated_data = super(CollectionSerializer, self).run_validation(data)
        validated_data['tags'] = Tag.objects.validate_tags(data['tags'])
        if 'technologies' in data:
            validated_data['technologies'] = data['technologies']
        if 'resources' in data:
            validated_data['resources'] = data['resources']
        return validated_data

    @staticmethod
    def select_options_data(data):
        return CollectionSelectOptionSerializer(data, many=True)


class CollectionResourceListingSerializer(serializers.ModelSerializer):
    # to be used in collection items
    queryset = Collection.resources.through.objects.all()
    study_resource = serializers.SerializerMethodField()

    class Meta:
        model = Collection.resources.through
        fields = ['study_resource', 'order']

    def get_study_resource(self, obj):
        # need to bypass the normal foreign object retrieving mechanism because it uses the default Manager
        # therefore we don't have access to the custom Manager
        res = StudyResource.objects.get(pk=obj.study_resource_id)
        return StudyResourceListingMinimalSerializer(res).data


class CollectionSerializerListing(serializers.ModelSerializer):
    queryset = Collection.objects
    tags = TagSerializerOption(many=True, read_only=True)
    technologies = TechnologySerializerOption(many=True, read_only=True)
    items_count = IntegerField(read_only=True)

    class Meta:
        model = Collection
        fields = [
            'pk', 'name', 'tags', 'technologies', 'items_count', 'is_public', 'absolute_url',
            'thumbs_up', 'thumbs_down',
        ]