from rest_framework import serializers
from rest_framework.fields import FloatField, IntegerField
from .models import Tag, Technology, StudyResource, Review, Collection
from users.serializers import UserSerializerMinimal


class TagSerializer(serializers.ModelSerializer):
    queryset = Tag.objects

    class Meta:
        model = Tag
        fields = ['pk', 'name']


class TechnologySerializer(serializers.ModelSerializer):
    queryset = Technology.objects

    class Meta:
        model = Technology
        fields = ['pk', 'name', 'description', 'version', 'url']


class TechnologySerializerShort(serializers.ModelSerializer):
    queryset = Technology.objects

    class Meta:
        model = Technology
        fields = ['pk', 'name', 'version']


class StudyResourceSerializer(serializers.ModelSerializer):
    queryset = StudyResource.objects
    author = UserSerializerMinimal(many=False, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    technologies = TechnologySerializerShort(many=True, read_only=True)
    rating = FloatField(read_only=True)

    class Meta:
        model = StudyResource
        fields = ['pk', 'rating', 'reviews_count', 'name', 'url', 'summary', 'price', 'media', 'experience_level', 'author', 'tags',
                  'technologies', 'created_at', 'updated_at', 'publication_date', 'published_by']

    def run_validation(self, data):
        validated_data = super(StudyResourceSerializer, self).run_validation(data)
        validated_data['tags'] = []
        for tag in data['tags']:
            if type(tag) == int:
                validated_data['tags'].append(tag)
            else:
                new_tag = Tag.objects.create(name=tag)
                validated_data['tags'].append(new_tag.id)
        validated_data['technologies'] = data['technologies']
        return validated_data


class ReviewSerializer(serializers.ModelSerializer):
    queryset = Review.objects
    study_resource = StudyResourceSerializer
    author = UserSerializerMinimal(many=False, read_only=True)

    class Meta:
        model = Review
        fields = ['pk', 'author', 'study_resource', 'rating', 'thumbs_up', 'thumbs_down', 'text', 'visible',
                  'created_at', 'updated_at', 'thumbs_up_array', 'thumbs_down_array']


class CollectionSerializer(serializers.ModelSerializer):
    queryset = Collection.objects
    owner = UserSerializerMinimal(many=False, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    technologies = TechnologySerializerShort(many=True, read_only=True)
    items_count = IntegerField(read_only=True)

    class Meta:
        model = Collection
        fields = ['pk', 'name', 'description', 'created_at', 'owner', 'tags', 'technologies', 'items_count']

    def run_validation(self, data):
        validated_data = super(CollectionSerializer, self).run_validation(data)
        validated_data['tags'] = []
        for tag in data['tags']:
            if type(tag) == int:
                validated_data['tags'].append(tag)
            else:
                new_tag = Tag.objects.create(name=tag)
                validated_data['tags'].append(new_tag.id)
        validated_data['technologies'] = data['technologies']
        if 'resources' in data:
            validated_data['resources'] = data['resources']
        return validated_data
