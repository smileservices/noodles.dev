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


class TechnologyEditSerializer(serializers.ModelSerializer):
    queryset = Technology.edit_suggestions
    ecosystem = TechnologySerializerOption(many=True)
    edit_suggestion_author = UserSerializerMinimal()

    class Meta:
        model = Technology.edit_suggestions.model
        depth = 1
        fields = ['pk', 'name', 'description', 'url', 'license', 'owner', 'pros', 'cons', 'limitations',
                  'ecosystem', 'edit_suggestion_date_created', 'edit_suggestion_author', 'edit_suggestion_status',
                  'edit_suggestion_reason', 'edit_suggestion_reject_reason', 'thumbs_up', 'thumbs_down']


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

    def run_validation(self, data):
        validated_data = super().run_validation(data)
        validated_data['ecosystem'] = data['ecosystem']
        return validated_data