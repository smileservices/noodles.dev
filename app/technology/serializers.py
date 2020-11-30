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
        fields = ['value', 'label', 'name', 'version']

    def get_value(self, obj):
        return obj.pk

    def get_label(self, obj):
        return f'{obj.name}' if not obj.version else f'{obj.name} {obj.version}'


class TechnologyEditSerializer(serializers.ModelSerializer):
    queryset = Technology.edit_suggestions
    ecosystem = TechnologySerializerOption(many=True)
    edit_suggestion_author = UserSerializerMinimal()

    class Meta:
        model = Technology.edit_suggestions.model
        depth = 1
        fields = ['pk', 'name', 'description', 'version', 'url', 'license', 'owner', 'pros', 'cons', 'limitations',
                  'ecosystem', 'edit_suggestion_date_created', 'edit_suggestion_author', 'edit_suggestion_status',
                  'edit_suggestion_reason', 'edit_suggestion_reject_reason', 'thumbs_up', 'thumbs_down']


class TechnologySerializer(EditSuggestionSerializer):
    queryset = Technology.objects.all()
    ecosystem = TechnologySerializerOption(many=True)

    class Meta:
        model = Technology
        depth = 1
        fields = ['pk', 'name', 'description', 'version', 'url', 'license', 'owner', 'pros', 'cons', 'limitations',
                  'ecosystem', 'thumbs_up', 'thumbs_down']

    @staticmethod
    def get_edit_suggestion_serializer():
        return TechnologyEditSerializer
