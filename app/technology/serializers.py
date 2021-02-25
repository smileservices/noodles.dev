import json
from rest_framework import serializers
from rest_framework import exceptions
from rest_framework import fields
from rest_framework.serializers import SerializerMethodField
from versatileimagefield.serializers import VersatileImageFieldSerializer
from django.conf import settings
from .models import Technology
from users.serializers import UserSerializerMinimal
from category.serializers import CategorySerializerOption
from category.models import Category
from django_edit_suggestion.rest_serializers import EditSuggestionSerializer
from django.template.defaultfilters import slugify
from core import utils


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
        validated_data = super(TechnologyEditSerializer, self).run_validation(data)
        validated_data['ecosystem'] = [int(t) for t in data['ecosystem'].split(',')] if data['ecosystem'] else []
        validated_data['category_id'] = Category.objects.validate_category(int(data['category']))
        return validated_data

    def get_changes(self, instance):
        # return a list of dicts with changed fields and old/new values
        delta = instance.diff_against_parent()
        result = []
        for change in delta.changes:
            if change.field == 'ecosystem':
                result.append({'field': change.field.capitalize(),
                               'type': 'text',
                               'old': ', '.join([t.name for t in change.old]),
                               'new': ', '.join([t.name for t in change.new])
                               })
            elif change.field == 'category':
                result.append({'field': change.field.capitalize(),
                               'type': 'text',
                               'old': Category.objects.get(pk=change.old).name,
                               'new': Category.objects.get(pk=change.new).name
                               })
            elif change.field == 'image_file':
                result.append({'field': 'Logo',
                               'type': 'image',
                               'old': instance.edit_suggestion_parent.logo,
                               'new': instance.logo
                               })
            else:
                result.append(
                    {'field': change.field.capitalize(), 'type': 'text', 'old': change.old, 'new': change.new})
        return result


class TechnologySerializer(EditSuggestionSerializer):
    queryset = Technology.objects.all()
    ecosystem = TechnologySerializerOption(many=True, read_only=True)
    category = CategorySerializerOption(read_only=True)
    image_file = VersatileImageFieldSerializer(
        sizes=settings.VERSATILEIMAGEFIELD_RENDITION_KEY_SETS['technology_logo'],
        required=False,
    )
    image_url = fields.CharField(required=False) # for handling image from url

    class Meta:
        model = Technology
        depth = 1
        fields = ['pk', 'name', 'image_file', 'description', 'url', 'license', 'owner', 'pros', 'cons', 'limitations',
                  'absolute_url', 'category',
                  'ecosystem', 'thumbs_up', 'thumbs_down',
                  'image_url'
                  ]

    @staticmethod
    def get_edit_suggestion_serializer():
        return TechnologyEditSerializer

    @staticmethod
    def get_edit_suggestion_listing_serializer():
        return TechnologyEditSuggestionListingSerializer

    def run_validation(self, data):
        validated_data = super(TechnologySerializer, self).run_validation(data)
        if 'pk' in data and ('image_file' not in data and 'image_url' not in data):
            # edits without image (image_file or image_url) must not modify the model!
            # populate with parent image file otherwise the edit will set the image_file blank
            validated_data['image_file'] = self.queryset.values('image_file').get(pk=data['pk'])['image_file']
        if 'image_url' in data:
            # handle images from url and uploaded images
            try:
                validated_data['image_file'] = utils.get_temp_image_file_from_url(data['image_url'])
                del validated_data['image_url']
            except Exception as e:
                raise exceptions.ValidationError('Error getting the image from specified url')
        validated_data['slug'] = slugify(validated_data['name'])
        validated_data['ecosystem'] = [int(t) for t in data['ecosystem'].split(',')] if data['ecosystem'] else []
        validated_data['category_id'] = Category.objects.validate_category(int(data['category']))
        return validated_data


class TechnologyListing(serializers.ModelSerializer):
    queryset = Technology.objects.all()
    category = CategorySerializerOption(read_only=True)
    ecosystem = TechnologySerializerOption(read_only=True, many=True)

    class Meta:
        model = Technology
        fields = ['pk', 'name', 'license', 'absolute_url', 'category', 'ecosystem',
                  'thumbs_up', 'thumbs_down']
