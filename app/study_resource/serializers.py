from rest_framework import serializers
from .models import Tag, Technology, StudyResource, Review
from django.db.models import Avg
from users.serializers import UserSerializerMinimal


class TagSerializer(serializers.ModelSerializer):
    queryset = Tag.objects.all()

    class Meta:
        model = Tag
        fields = ['pk', 'name']


class TechnologySerializer(serializers.ModelSerializer):
    queryset = Technology.objects.all()

    class Meta:
        model = Technology
        fields = ['pk', 'name', 'description', 'version', 'url']


class TechnologySerializerShort(serializers.ModelSerializer):
    queryset = Technology.objects.all()

    class Meta:
        model = Technology
        fields = ['pk', 'name', 'version']


class StudyResourceSerializer(serializers.ModelSerializer):
    queryset = StudyResource.objects.annotate_with_rating()
    author = UserSerializerMinimal(many=False, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    technologies = TechnologySerializerShort(many=True, read_only=True)

    class Meta:
        model = StudyResource
        fields = ['pk', 'name', 'url', 'summary', 'price', 'media', 'experience_level', 'author', 'tags',
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
    queryset = Review.objects.all()
    study_resource = StudyResourceSerializer
    author = UserSerializerMinimal(many=False,read_only=True)

    class Meta:
        model = Review
        fields = ['pk', 'author', 'study_resource', 'rating', 'thumbs_up', 'thumbs_down', 'text', 'visible', 'created_at', 'updated_at', 'thumbs_up_array', 'thumbs_down_array']