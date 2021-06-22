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
                  'thumbs_up_array', 'thumbs_down_array', 'featured']

    def run_validation(self, data):
        validated_data = super(TechnologyEditSerializer, self).run_validation(data)
        if data['featured']:
            raise exceptions.ValidationError({'is_featured': 'Only admins can change the Is Featured status.'})
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
        validated_data['category'] = [int(t) for t in data['category'].split(',')] if data['category'] else []
        validated_data['ecosystem'] = [int(t) for t in data['ecosystem'].split(',')] if data['ecosystem'] else []
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
                               'old': ', '.join([c.name_tree for c in change.old]),
                               'new': ', '.join([c.name_tree for c in change.new])
                               })
            elif change.field == 'license':
                result.append({'field': change.field.capitalize(),
                               'type': 'text',
                               'old': delta.old_record.license_label,
                               'new': Technology.LicenseType(delta.new_record.license).label
                               })
            elif change.field == 'image_file':
                result.append({'field': 'Logo',
                               'type': 'image',
                               'old': instance.edit_suggestion_parent.logo,
                               'new': instance.logo
                               })
            elif change.field == 'slug':
                continue
            else:
                result.append(
                    {'field': change.field.capitalize(), 'type': 'text', 'old': change.old, 'new': change.new})
        return result


class TechnologySerializer(EditSuggestionSerializer):
    queryset = Technology.objects.all()
    ecosystem = TechnologySerializerOption(many=True, read_only=True)
    category = CategorySerializerOption(read_only=True, many=True)
    image_file = VersatileImageFieldSerializer(
        sizes=settings.VERSATILEIMAGEFIELD_RENDITION_KEY_SETS['technology_logo'],
        required=False,
    )
    image_url = fields.CharField(required=False)  # for handling image from url
    meta = fields.JSONField(required=False)
    license_option = SerializerMethodField()

    class Meta:
        model = Technology
        depth = 1
        fields = ['pk', 'name', 'image_file', 'description', 'description_long',
                  'url', 'license_option', 'owner', 'license', 'meta',
                  'absolute_url', 'category',
                  'ecosystem', 'thumbs_up', 'thumbs_down',
                  'image_url', 'featured'
                  ]

    def get_license_option(self, obj):
        return {'value': obj.license, 'label': obj.license_label}

    @staticmethod
    def get_edit_suggestion_serializer():
        return TechnologyEditSerializer

    @staticmethod
    def get_edit_suggestion_listing_serializer():
        return TechnologyEditSuggestionListingSerializer

    def run_validation(self, data):
        validated_data = super(TechnologySerializer, self).run_validation(data)
        db_instance = self.queryset.values('image_file', 'featured').get(pk=data['pk']) if 'pk' in data else False
        if (not db_instance and validated_data['featured']) or (
                db_instance and db_instance['featured'] != validated_data['featured']):
            if not self.context['request'].user.is_staff:
                raise exceptions.ValidationError({'detail': 'Only admins can change or create Featured field',
                                                  'featured': 'Only admins can create or change the Featured property of the technology'})
        if db_instance and ('image_file' not in data and 'image_url' not in data):
            # edits without image (image_file or image_url) must not modify the model!
            # populate with parent image file otherwise the edit will set the image_file blank
            validated_data['image_file'] = db_instance['image_file']
        if 'image_url' in data:
            # handle images from url and uploaded images
            try:
                validated_data['image_file'] = utils.get_temp_image_file_from_url(data['image_url'])
                del validated_data['image_url']
            except Exception as e:
                raise exceptions.ValidationError('Error getting the image from specified url')
        validated_data['slug'] = slugify(validated_data['name'])
        validated_data['category'] = [int(t) for t in data['category'].split(',')] if data['category'] else []
        validated_data['ecosystem'] = [int(t) for t in data['ecosystem'].split(',')] if data['ecosystem'] else []
        return validated_data


class TechnologyListing(serializers.ModelSerializer):
    queryset = Technology.objects.all()
    category = CategorySerializerOption(read_only=True, many=True)
    ecosystem = TechnologySerializerOption(read_only=True, many=True)

    class Meta:
        model = Technology
        fields = ['pk', 'name', 'license', 'absolute_url', 'category', 'ecosystem',
                  'thumbs_up', 'thumbs_down']


class TechnologyMinimal(serializers.ModelSerializer):
    queryset = Technology.objects.all()

    class Meta:
        model = Technology
        fields = ['pk', 'name', 'absolute_url', 'thumbs_up', 'thumbs_down']
