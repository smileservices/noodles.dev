import rest_framework.fields as fields
from rest_framework.serializers import ModelSerializer
from django.template.defaultfilters import slugify
from . import models
from tag.serializers import TagSerializer
from tag.models import Tag
from technology.serializers import TechnologySerializerShort


# Problem Focused
class SolutionSerializerShort(ModelSerializer):
    queryset = models.Solution.objects.all()
    tags = TagSerializer(many=True, read_only=True)
    technologies = TechnologySerializerShort(many=True, read_only=True)

    class Meta:
        model = models.Solution
        depth = 1
        fields = ['pk', 'name', 'slug', 'description', 'tags', 'technologies']


class ProblemSerializer(ModelSerializer):
    queryset = models.Problem.objects.all()
    tags = TagSerializer(many=True, read_only=True)
    solutions = SolutionSerializerShort(many=True, read_only=True)

    class Meta:
        model = models.Problem
        depth = 1
        fields = ['pk', 'name', 'slug', 'description', 'parent', 'tags', 'solutions']

    def run_validation(self, data):
        if 'slug' not in data:
            data['slug'] = slugify(data['name'])
        validated_data = super().run_validation(data)
        validated_data['tags'] = Tag.objects.validate_tags(data['tags'])
        return validated_data


# Solution Focused
class SolutionSerializerMinimal(ModelSerializer):
    queryset = models.Solution.objects.all()
    tags = TagSerializer(many=True)
    technologies = TechnologySerializerShort(many=True)

    class Meta:
        model = models.Solution
        depth = 1
        fields = ['pk', 'name', 'slug', 'tags', 'technologies']


class ProblemSerializerShort(ModelSerializer):
    queryset = models.Problem.objects.all()
    tags = TagSerializer(many=True)
    solutions = SolutionSerializerMinimal(many=True)

    class Meta:
        model = models.Problem
        depth = 1
        fields = ['pk', 'name', 'slug', 'description', 'parent', 'tags', 'solutions']


class SolutionSerializer(ModelSerializer):
    queryset = models.Solution.objects.all()
    tags = TagSerializer(many=True)
    technologies = TechnologySerializerShort(many=True)
    parent = ProblemSerializerShort(many=False)

    class Meta:
        model = models.Solution
        depth = 1
        fields = ['pk', 'name', 'slug', 'description', 'parent', 'tags', 'technologies']

    def run_validation(self, data):
        if 'slug' not in data:
            data['slug'] = slugify(data['name'])
        validated_data = super().run_validation(data)
        validated_data['tags'] = Tag.objects.validate_tags(data['tags'])
        return validated_data
