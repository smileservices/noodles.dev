import rest_framework.fields as fields
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from django.template.defaultfilters import slugify
from django_edit_suggestion.rest_serializers import EditSuggestionSerializer

from . import models
from users.serializers import UserSerializerMinimal
from tag.serializers import TagSerializerOption
from tag.models import Tag
from technology.serializers import TechnologySerializerOption
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
    tags = TagSerializerOption(many=True, read_only=True)
    technologies = TechnologySerializerOption(many=True, read_only=True)
    problems_count = SerializerMethodField()
    problems = ProblemSerializerMinimal(many=True, read_only=True)

    class Meta:
        model = models.Solution
        depth = 1
        fields = ['pk', 'name', 'slug', 'description', 'tags', 'technologies', 'problems_count', 'problems',
                  'absolute_url']

    def get_problems_count(self, obj):
        return obj.problems.count()


class ProblemEditSuggestionSerializer(ModelSerializer):
    queryset = models.Problem.edit_suggestions.all()
    tags = TagSerializerOption(many=True, read_only=True)
    solutions = SolutionSerializerShort(many=True, read_only=True)
    parent = SolutionSerializerMinimal(read_only=True)
    edit_suggestion_author = UserSerializerMinimal(read_only=True)
    edit_suggestion_parent = ProblemSerializerMinimal(read_only=True)
    changes = SerializerMethodField()

    class Meta:
        model = models.Problem.edit_suggestions.model
        depth = 1
        fields = ['pk', 'name', 'slug', 'description', 'parent', 'tags', 'solutions',
                  'edit_suggestion_author', 'edit_suggestion_date_created', 'edit_suggestion_parent', 'changes',
                  'thumbs_up_array', 'thumbs_down_array']

    def run_validation(self, data):
        if 'slug' not in data:
            data['slug'] = slugify(data['name'])
        validated_data = super().run_validation(data)
        if 'parent' in data:
            if not data['parent']:
                del data['parent']
            else:
                validated_data['parent_id'] = data['parent']
        validated_data['tags'] = Tag.objects.validate_tags(data['tags'])
        return validated_data

    def get_changes(self, instance):
        # return a list of dicts with changed fields and old/new values
        delta = instance.diff_against_parent()
        result = []
        for change in delta.changes:
            if change.field == 'tags':
                result.append({'field': change.field.capitalize(),
                               'old': ', '.join([t.name for t in change.old]),
                               'new': ', '.join([t.name for t in change.new])
                               })
            else:
                result.append({'field': change.field.capitalize(), 'old': change.old, 'new': change.new})
        return result


class ProblemEditSuggestionListingSerializer(ModelSerializer):
    queryset = models.Problem.edit_suggestions.all()
    edit_suggestion_author = UserSerializerMinimal(read_only=True)

    class Meta:
        model = models.Problem.edit_suggestions.model
        fields = ['pk',
                  'edit_suggestion_reason', 'edit_suggestion_author', 'edit_suggestion_date_created',
                  'thumbs_up', 'thumbs_down']


class ProblemSerializer(EditSuggestionSerializer):
    queryset = models.Problem.objects.all()
    tags = TagSerializerOption(many=True, read_only=True)
    solutions = SolutionSerializerShort(many=True, read_only=True)
    parent = SolutionSerializerMinimal(read_only=True)
    author = UserSerializerMinimal(read_only=True)

    class Meta:
        model = models.Problem
        depth = 1
        fields = ['pk', 'name', 'author', 'slug', 'description', 'parent', 'tags', 'solutions', 'absolute_url',
                  'thumbs_up', 'thumbs_down']

    def run_validation(self, data):
        if 'parent' in data and data['parent'] is False:
            del data['parent']
        if 'slug' not in data:
            data['slug'] = slugify(data['name'])
        validated_data = super().run_validation(data)
        if 'parent' in data:
            validated_data['parent_id'] = data['parent']
        validated_data['tags'] = Tag.objects.validate_tags(data['tags'])
        return validated_data

    @staticmethod
    def get_edit_suggestion_serializer():
        return ProblemEditSuggestionSerializer

    @staticmethod
    def get_edit_suggestion_listing_serializer():
        return ProblemEditSuggestionListingSerializer


# Solution Focused

class ProblemSerializerShort(ModelSerializer):
    queryset = models.Problem.objects.all()
    tags = TagSerializerOption(many=True, read_only=True)
    solutions = SolutionSerializerMinimal(many=True, read_only=True)
    solutions_count = SerializerMethodField(read_only=True)

    class Meta:
        model = models.Problem
        fields = ['pk', 'name', 'slug', 'description', 'tags', 'solutions', 'solutions_count', 'absolute_url']

    def get_solutions_count(self, obj):
        return obj.solutions.count()


class SolutionEditSuggestionListingSerializer(ModelSerializer):
    queryset = models.Solution.edit_suggestions.all()
    edit_suggestion_author = UserSerializerMinimal(read_only=True)

    class Meta:
        model = models.Solution.edit_suggestions.model
        fields = ['pk',
                  'edit_suggestion_reason', 'edit_suggestion_author', 'edit_suggestion_date_created',
                  'thumbs_up', 'thumbs_down']


class SolutionEditSuggestionSerializer(ModelSerializer):
    queryset = models.Solution.edit_suggestions.all()
    tags = TagSerializerOption(many=True, read_only=True)
    technologies = TechnologySerializerOption(many=True, read_only=True)
    parent = ProblemSerializerShort(many=False, read_only=True)
    problems = ProblemSerializerShort(many=True, read_only=True)
    edit_suggestion_author = UserSerializerMinimal(read_only=True)
    changes = SerializerMethodField()

    class Meta:
        model = models.Solution.edit_suggestions.model
        fields = ['pk', 'name', 'slug', 'description', 'parent', 'tags', 'technologies', 'problems',
                  'edit_suggestion_author', 'edit_suggestion_date_created', 'edit_suggestion_parent', 'changes',
                  'thumbs_up_array', 'thumbs_down_array',]

    def run_validation(self, data):
        if 'slug' not in data:
            data['slug'] = slugify(data['name'])
        validated_data = super().run_validation(data)
        validated_data['parent_id'] = data['parent']
        validated_data['tags'] = Tag.objects.validate_tags(data['tags'])
        validated_data['technologies'] = data['technologies']
        return validated_data

    def get_changes(self, instance):
        # return a list of dicts with changed fields and old/new values
        delta = instance.diff_against_parent()
        result = []
        for change in delta.changes:
            if change.field == 'tags':
                result.append({'field': change.field.capitalize(),
                               'old': ', '.join([t.name for t in change.old]),
                               'new': ', '.join([t.name for t in change.new])
                               })
            if change.field == 'technologies':
                result.append({'field': change.field.capitalize(),
                               'old': ', '.join([t.name for t in change.old]),
                               'new': ', '.join([t.name for t in change.new])
                               })
            else:
                result.append({'field': change.field.capitalize(), 'old': change.old, 'new': change.new})
        return result


class SolutionSerializer(EditSuggestionSerializer):
    queryset = models.Solution.objects.all()
    tags = TagSerializerOption(many=True, read_only=True)
    technologies = TechnologySerializerOption(many=True, read_only=True)
    parent = ProblemSerializerShort(many=False, read_only=True)
    problems = ProblemSerializerShort(many=True, read_only=True)
    author = UserSerializerMinimal(read_only=True)

    class Meta:
        model = models.Solution
        fields = ['pk', 'author', 'name', 'slug', 'description', 'parent', 'tags', 'technologies', 'absolute_url',
                  'problems', 'thumbs_up', 'thumbs_down']

    def run_validation(self, data):
        if 'slug' not in data:
            data['slug'] = slugify(data['name'])
        validated_data = super().run_validation(data)
        validated_data['parent_id'] = data['parent']
        validated_data['tags'] = Tag.objects.validate_tags(data['tags'])
        validated_data['technologies'] = data['technologies']
        return validated_data

    @staticmethod
    def get_edit_suggestion_serializer():
        return SolutionEditSuggestionSerializer

    @staticmethod
    def get_edit_suggestion_listing_serializer():
        return SolutionEditSuggestionListingSerializer
