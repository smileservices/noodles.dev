from rest_framework import serializers
from rest_framework.fields import SerializerMethodField
from .models import CategoryConcept
from django_edit_suggestion.rest_serializers import EditSuggestionSerializer
from users.serializers import UserSerializerMinimal
from category.models import Category
from django.template.defaultfilters import slugify


class CategoryConceptSerializerListing(serializers.ModelSerializer):
    queryset = CategoryConcept.objects

    class Meta:
        model = CategoryConcept
        fields = ['pk', 'name', 'absolute_url']


class CategoryConceptSerializerOption(serializers.ModelSerializer):
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


class CategoryConceptEditSuggestionSerializer(serializers.ModelSerializer):
    queryset = CategoryConcept.edit_suggestions.all()
    edit_suggestion_author = UserSerializerMinimal(read_only=True)
    changes = serializers.SerializerMethodField()

    class Meta:
        model = CategoryConcept.edit_suggestions.model
        fields = ['pk',
                  'edit_suggestion_date_created', 'edit_suggestion_author', 'edit_suggestion_status',
                  'edit_suggestion_reason', 'edit_suggestion_reject_reason', 'changes',
                  'thumbs_up_array', 'thumbs_down_array']

    def get_changes(self, instance):
        # return a list of dicts with changed fields and old/new values
        delta = instance.diff_against_parent()
        result = []
        for change in delta.changes:
            if change.field == 'experience_level':
                result.append({'field': 'Experience Level',
                               'old': delta.old_record.experience_level_label,
                               'new': delta.old_record.ExperienceLevel(instance.experience_level).label
                               })
            elif change.field == 'category':
                result.append({'field': change.field.capitalize(),
                               'old': Category.objects.get(pk=change.old).name,
                               'new': Category.objects.get(pk=change.new).name
                               })
            elif change.field == 'slug':
                continue
            else:
                result.append({'field': change.field.capitalize(), 'old': change.old, 'new': change.new})
        return result


class CategoryConceptEditSuggestionListingSerializer(serializers.ModelSerializer):
    queryset = CategoryConcept.edit_suggestions.all()
    edit_suggestion_author = UserSerializerMinimal(read_only=True)

    class Meta:
        model = CategoryConcept.edit_suggestions.model
        fields = ['pk',
                  'edit_suggestion_reason', 'edit_suggestion_author', 'edit_suggestion_date_created',
                  'thumbs_up', 'thumbs_down']


class CategoryConceptSerializer(EditSuggestionSerializer):
    queryset = CategoryConcept.objects.all()
    author = UserSerializerMinimal(many=False, read_only=True)
    parent = CategoryConceptSerializerListing(many=False, read_only=True)

    class Meta:
        model = CategoryConcept
        fields = ['pk', 'name', 'description', 'absolute_url', 'slug', 'parent',
                  'experience_level', 'name_tree',
                  'author', 'category', 'created_at', 'updated_at']

    @staticmethod
    def get_edit_suggestion_serializer():
        return CategoryConceptEditSuggestionSerializer

    @staticmethod
    def get_edit_suggestion_listing_serializer():
        return CategoryConceptEditSuggestionListingSerializer

    def run_validation(self, data):
        data_copy = data.copy()
        if 'slug' not in data:
            data_copy['slug'] = slugify(data['name'])
        validated_data = super(CategoryConceptSerializer, self).run_validation(data_copy)
        if 'parent' in data_copy and data_copy['parent']:
            validated_data['parent_id'] = int(data_copy['parent'])
        return validated_data
