from rest_framework import serializers
from rest_framework.fields import SerializerMethodField
from .models import CategoryConcept
from django_edit_suggestion.rest_serializers import EditSuggestionSerializer
from users.serializers import UserSerializerMinimal
from category.models import Category
from django.template.defaultfilters import slugify
from category.serializers import CategorySerializerOption


class CategoryConceptSerializerListing(serializers.ModelSerializer):
    queryset = CategoryConcept.objects

    class Meta:
        model = CategoryConcept
        fields = ['pk', 'name', 'absolute_url', 'experience_level']


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
            elif change.field == 'parent':
                old_val = CategoryConcept.objects.get(pk=change.old) if change.old else False
                new_val = CategoryConcept.objects.get(pk=change.new) if change.new else False
                result.append({'field': change.field.capitalize(),
                               'old': old_val.name if old_val else '',
                               'new': new_val.name if new_val else ''
                               })
            elif change.field == 'slug':
                continue
            elif change.field == 'meta':
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
    category = CategorySerializerOption(many=False, read_only=True)
    parent = CategoryConceptSerializerOption(many=False, read_only=True)

    class Meta:
        model = CategoryConcept
        fields = ['pk', 'name', 'description', 'description_long', 'absolute_url', 'slug', 'parent',
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
        data_copy['slug'] = slugify(data['name'])
        validated_data = super(CategoryConceptSerializer, self).run_validation(data_copy)
        validated_data['category_id'] = int(data_copy['category'])
        if 'parent' in data_copy:
            if data_copy['parent']:
                validated_data['parent_id'] = int(data_copy['parent'])
            else:
                validated_data['parent_id'] = None
        return validated_data
