from rest_framework import serializers
from django.template.defaultfilters import slugify
from django_edit_suggestion.rest_serializers import EditSuggestionSerializer

from users.serializers import UserSerializerMinimal
from technology.serializers import TechnologySerializerOption
from technology.models import Technology

from .models import TechnologyConcept, CategoryConcept
from .serializers_category import CategoryConceptSerializerListing, CategoryConceptSerializerOption


class TechnologyConceptEditSuggestionSerializer(serializers.ModelSerializer):
    queryset = TechnologyConcept.edit_suggestions.all()
    edit_suggestion_author = UserSerializerMinimal(read_only=True)
    changes = serializers.SerializerMethodField()

    class Meta:
        model = TechnologyConcept.edit_suggestions.model
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
            elif change.field == 'technology':
                result.append({'field': change.field.capitalize(),
                               'old': Technology.objects.get(pk=change.old).name,
                               'new': Technology.objects.get(pk=change.new).name
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


class TechnologyConceptEditSuggestionListingSerializer(serializers.ModelSerializer):
    queryset = TechnologyConcept.edit_suggestions.all()
    edit_suggestion_author = UserSerializerMinimal(read_only=True)

    class Meta:
        model = TechnologyConcept.edit_suggestions.model
        fields = ['pk',
                  'edit_suggestion_reason', 'edit_suggestion_author', 'edit_suggestion_date_created',
                  'thumbs_up', 'thumbs_down']


class TechnologyConceptSerializerOption(EditSuggestionSerializer):
    queryset = TechnologyConcept.objects.all()
    label = serializers.SerializerMethodField()
    value = serializers.SerializerMethodField()

    class Meta:
        model = TechnologyConcept
        fields = ['value', 'label']

    def get_label(self, obj):
        return obj.name

    def get_value(self, obj):
        return obj.pk


class TechnologyConceptSerializer(EditSuggestionSerializer):
    queryset = TechnologyConcept.objects.all()
    author = UserSerializerMinimal(many=False, read_only=True)
    technology = TechnologySerializerOption(many=False, read_only=True)
    parent = CategoryConceptSerializerOption(many=False, read_only=True)

    class Meta:
        model = TechnologyConcept
        fields = ['pk', 'name', 'description','description_long', 'absolute_url', 'slug',
                  'parent', 'technology', 'experience_level',
                  'author', 'created_at', 'updated_at']

    @staticmethod
    def get_edit_suggestion_serializer():
        return TechnologyConceptEditSuggestionSerializer

    @staticmethod
    def get_edit_suggestion_listing_serializer():
        return TechnologyConceptEditSuggestionListingSerializer

    def run_validation(self, data):
        data_copy = data.copy()
        if 'slug' not in data:
            data_copy['slug'] = slugify(data['name'])
        validated_data = super(TechnologyConceptSerializer, self).run_validation(data_copy)
        validated_data['technology_id'] = int(data_copy['technology'])
        if 'parent' in data_copy:
            if data_copy['parent']:
                validated_data['parent_id'] = int(data_copy['parent'])
            else:
                validated_data['parent_id'] = None
        return validated_data
