import rest_framework.fields as fields
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from django.template.defaultfilters import slugify
from . import models
from tag.serializers import TagSerializerSelect
from tag.models import Tag
from technology.serializers import TechnologySerializerShort
from technology.models import Technology


# Problem Focused
class SolutionSerializerMinimal(ModelSerializer):
    queryset = models.Solution.objects.all()

    class Meta:
        model = models.Solution
        fields = ['pk', 'name', 'absolute_url']


class ProblemSerializerMinimal(ModelSerializer):
    queryset = models.Problem.objects.all()

    class Meta:
        model = models.Problem
        fields = ['pk', 'name', 'absolute_url']


class SolutionSerializerShort(ModelSerializer):
    queryset = models.Solution.objects.all()
    tags = TagSerializerSelect(many=True, read_only=True)
    technologies = TechnologySerializerShort(many=True, read_only=True)
    problems_count = SerializerMethodField()
    problems = ProblemSerializerMinimal(many=True, read_only=True)

    class Meta:
        model = models.Solution
        depth = 1
        fields = ['pk', 'name', 'slug', 'description', 'tags', 'technologies', 'problems_count', 'problems',
                  'absolute_url']

    def get_problems_count(self, obj):
        return obj.problems.count()


class ProblemSerializer(ModelSerializer):
    queryset = models.Problem.objects.all()
    tags = TagSerializerSelect(many=True, read_only=True)
    solutions = SolutionSerializerShort(many=True, read_only=True)
    parent = SolutionSerializerMinimal(read_only=True)

    class Meta:
        model = models.Problem
        depth = 1
        fields = ['pk', 'name', 'slug', 'description', 'parent', 'tags', 'solutions', 'absolute_url']

    def run_validation(self, data):
        if 'slug' not in data:
            data['slug'] = slugify(data['name'])
        validated_data = super().run_validation(data)
        validated_data['tags'] = Tag.objects.validate_tags(data['tags'])
        return validated_data


# Solution Focused

class ProblemSerializerShort(ModelSerializer):
    queryset = models.Problem.objects.all()
    tags = TagSerializerSelect(many=True, read_only=True)
    solutions = SolutionSerializerMinimal(many=True, read_only=True)
    solutions_count = SerializerMethodField(read_only=True)

    class Meta:
        model = models.Problem
        fields = ['pk', 'name', 'slug', 'description', 'tags', 'solutions', 'solutions_count', 'absolute_url']

    def get_solutions_count(self, obj):
        return obj.solutions.count()


class SolutionSerializer(ModelSerializer):
    queryset = models.Solution.objects.all()
    tags = TagSerializerSelect(many=True, read_only=True)
    technologies = TechnologySerializerShort(many=True, read_only=True)
    parent = ProblemSerializerShort(many=False, read_only=True)
    problems = ProblemSerializerShort(many=True, read_only=True)

    class Meta:
        model = models.Solution
        fields = ['pk', 'name', 'slug', 'description', 'parent', 'tags', 'technologies', 'absolute_url', 'problems']

    def run_validation(self, data):
        if 'slug' not in data:
            data['slug'] = slugify(data['name'])
        validated_data = super().run_validation(data)
        validated_data['parent_id'] = data['parent']
        validated_data['tags'] = Tag.objects.validate_tags(data['tags'])
        validated_data['technologies'] = data['technologies']
        return validated_data
