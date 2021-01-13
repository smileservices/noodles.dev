from rest_framework import serializers
from rest_framework import fields
from rest_framework.serializers import SerializerMethodField
from .models import Technology
from users.serializers import UserSerializerMinimal
from django_edit_suggestion.rest_serializers import EditSuggestionSerializer


class TechnologySerializerOption(serializers.ModelSerializer):
    queryset = Technology.objects
    value = SerializerMethodField()
    label = SerializerMethodField()

    class Meta:
        model = Technology
        fields = ['value', 'label', 'name']

    def get_value(self, obj):
        return obj.pk

    def get_label(self, obj):
        return f'{obj.name}'


class TechnologyEditSuggestionListingSerializer(serializers.ModelSerializer):
    queryset = Technology.edit_suggestions.all()
    edit_suggestion_author = UserSerializerMinimal(read_only=True)

    class Meta:
        model = Technology.edit_suggestions.model
        fields = ['pk',
                  'edit_suggestion_reason', 'edit_suggestion_author', 'edit_suggestion_date_created',
                  'thumbs_up', 'thumbs_down']


class TechnologyEditSerializer(serializers.ModelSerializer):
    queryset = Technology.edit_suggestions
    edit_suggestion_author = UserSerializerMinimal()
    changes = SerializerMethodField()

    class Meta:
        model = Technology.edit_suggestions.model
        depth = 1
        fields = ['pk',
                  'edit_suggestion_date_created', 'edit_suggestion_author', 'edit_suggestion_status',
                  'edit_suggestion_reason', 'edit_suggestion_reject_reason', 'edit_suggestion_parent',
                  'changes',
                  'thumbs_up_array', 'thumbs_down_array']

    def run_validation(self, data):
        validated_data = super().run_validation(data)
        validated_data['ecosystem'] = data['ecosystem']
        return validated_data

    def get_changes(self, instance):
        # return a list of dicts with changed fields and old/new values
        delta = instance.diff_against_parent()
        result = []
        for change in delta.changes:
            if change.field == 'ecosystem':
                result.append({'field': change.field.capitalize(),
                               'old': ', '.join([t.name for t in change.old]),
                               'new': ', '.join([t.name for t in change.new])
                               })
            else:
                result.append({'field': change.field.capitalize(), 'old': change.old, 'new': change.new})
        return result


class TechnologySerializer(EditSuggestionSerializer):
    queryset = Technology.objects.all()
    ecosystem = TechnologySerializerOption(many=True, read_only=True)

    class Meta:
        model = Technology
        depth = 1
        fields = ['pk', 'name', 'description', 'url', 'license', 'owner', 'pros', 'cons', 'limitations', 'absolute_url',
                  'ecosystem', 'thumbs_up', 'thumbs_down']

    @staticmethod
    def get_edit_suggestion_serializer():
        return TechnologyEditSerializer

    @staticmethod
    def get_edit_suggestion_listing_serializer():
        return TechnologyEditSuggestionListingSerializer

    def run_validation(self, data):
        validated_data = super().run_validation(data)
        validated_data['ecosystem'] = data['ecosystem']
        return validated_data
