from rest_framework import serializers
from rest_framework.fields import FloatField, IntegerField
from rest_framework import exceptions
from .models import StudyResource, Review, StudyResourceImage, StudyResourceTechnology
from users.serializers import UserSerializerMinimal
from django.template.defaultfilters import slugify
from versatileimagefield.serializers import VersatileImageFieldSerializer
from django.conf import settings
from django_edit_suggestion.rest_serializers import EditSuggestionSerializer
from tag.serializers import TagSerializerOption
from core import utils
from tag.models import Tag
from category.serializers import CategorySerializerOption
from category.models import Category
from technology.models import Technology
import json

class ImageSerializer(serializers.ModelSerializer):
    queryset = StudyResourceImage.objects
    image_file = VersatileImageFieldSerializer(
        sizes=settings.VERSATILEIMAGEFIELD_RENDITION_KEY_SETS['resource_image'],
        read_only=True
    )

    class Meta:
        model = StudyResourceImage
        fields = ['pk', 'study_resource', 'image_file', 'image_url']


class StudyResourceTechnologySerializer(serializers.ModelSerializer):
    queryset = StudyResourceTechnology.objects.all()
    url = serializers.SerializerMethodField()

    class Meta:
        model = StudyResourceTechnology
        fields = ['pk', 'technology_id', 'name', 'version', 'url']

    def get_url(self, obj):
        return obj.absolute_url


class StudyResourceEditSuggestionListingSerializer(serializers.ModelSerializer):
    queryset = StudyResource.edit_suggestions.all()
    edit_suggestion_author = UserSerializerMinimal(read_only=True)

    class Meta:
        model = StudyResource.edit_suggestions.model
        fields = ['pk',
                  'edit_suggestion_reason', 'edit_suggestion_author', 'edit_suggestion_date_created',
                  'thumbs_up', 'thumbs_down']


class StudyResourceEditSuggestionSerializer(serializers.ModelSerializer):
    queryset = StudyResource.edit_suggestions.all()
    edit_suggestion_author = UserSerializerMinimal(read_only=True)
    changes = serializers.SerializerMethodField()

    # handling images for edit suggestions is a todo
    # images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = StudyResource.edit_suggestions.model
        fields = ['pk',
                  'edit_suggestion_date_created', 'edit_suggestion_author', 'edit_suggestion_status',
                  'edit_suggestion_reason', 'edit_suggestion_reject_reason',
                  'changes',
                  'thumbs_up_array', 'thumbs_down_array']

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
            elif change.field == 'technologies':
                result.append({'field': change.field.capitalize(),
                               'old': ', '.join([f'{t.name} {t.version}' for t in
                                                 delta.old_record.studyresourcetechnology_set.all()]),
                               'new': ', '.join([
                                   f'{t.name} {t.version}' for t in
                                   instance.technologies.through.objects.filter(study_resource=instance.pk).all()
                               ])
                               })
            elif change.field == 'media':
                result.append({'field': change.field.capitalize(),
                               'old': delta.old_record.media_label,
                               'new': delta.old_record.Media(instance.media).label
                               })
            elif change.field == 'price':
                result.append({'field': change.field.capitalize(),
                               'old': delta.old_record.price_label,
                               'new': delta.old_record.Price(instance.price).label
                               })
            elif change.field == 'experience_level':
                result.append({'field': 'Experience Level',
                               'old': delta.old_record.experience_level_label,
                               'new': delta.old_record.ExperienceLevel(instance.experience_level).label
                               })
            elif change.field == 'category':
                result.append({'field': change.field.capitalize(),
                               'old': Category.objects.get(pk=change.old).name,
                               'new': Category.objects.get(pk=change.new).name
                               })
            elif change.field == 'image_file':
                result.append({'field': 'Image',
                               'type': 'image',
                               'old': instance.edit_suggestion_parent.image,
                               'new': instance.image
                               })
            elif change.field == 'slug':
                continue
            else:
                result.append({'field': change.field.capitalize(), 'old': change.old, 'new': change.new})
        return result


class StudyResourceSerializer(EditSuggestionSerializer):
    queryset = StudyResource.objects.all()
    author = UserSerializerMinimal(many=False, read_only=True)
    tags = TagSerializerOption(many=True, read_only=True)
    technologies = StudyResourceTechnologySerializer(source='studyresourcetechnology_set', many=True, read_only=True)
    rating = FloatField(read_only=True)
    reviews_count = IntegerField(read_only=True)
    image_file = VersatileImageFieldSerializer(
        sizes=settings.VERSATILEIMAGEFIELD_RENDITION_KEY_SETS['resource_image'],
        required=False,
    )
    category = CategorySerializerOption(read_only=True)

    class Meta:
        model = StudyResource
        fields = ['pk', 'rating', 'reviews_count', 'absolute_url', 'name', 'slug', 'url', 'summary', 'price', 'media',
                  'experience_level', 'author', 'tags', 'category',
                  'technologies', 'created_at', 'updated_at', 'publication_date', 'published_by', 'image_file']

    @staticmethod
    def get_edit_suggestion_serializer():
        return StudyResourceEditSuggestionSerializer

    @staticmethod
    def get_edit_suggestion_listing_serializer():
        return StudyResourceEditSuggestionListingSerializer

    def run_validation(self, data):
        data = data.copy()
        if 'slug' not in data:
            data['slug'] = slugify(data['name'])
        validated_data = super(StudyResourceSerializer, self).run_validation(data)
        # get tags out of the formdata serialized data
        # cleaned_tags = [int(t) for t in data['tags'].split(',')]
        # get category out of the data
        try:
            cleaned_category = int(data['category'])
        except ValueError:
            cleaned_category = data['category']
        # get technologies out of the data
        cleaned_technologies = json.loads(data['technologies'])
        validated_data['tags'] = Tag.objects.validate_tags(json.loads(data['tags']))
        if 'pk' in data and 'image_file' not in data:
            # populate with parent image file otherwise the edit will set the image_file blank
            validated_data['image_file'] = self.queryset.values('image_file').get(pk=data['pk'])['image_file']
        if 'image_url' in data:
            # handle images from url and uploaded images
            try:
                validated_data['image_file'] = utils.get_temp_image_file_from_url(data['image_url'])
            except Exception as e:
                raise exceptions.ValidationError(e)
        # validate technologies
        techs = []
        for tech in cleaned_technologies:
            if tech['technology_id'] in techs:
                raise AttributeError('Cannot add same technology multiple times')
            techs.append(tech['technology_id'])
        validated_data['technologies'] = cleaned_technologies
        validated_data['category_id'] = Category.objects.validate_category(cleaned_category)
        return validated_data

    def create(self, validated_data):
        # handle technologies and images separately
        m2m_fields = {
            'technologies': validated_data.pop('technologies'),
        }
        created_instance = super(StudyResourceSerializer, self).create(validated_data)
        self.handle_m2m_fields(created_instance, m2m_fields)
        return created_instance

    def update(self, instance, validated_data):
        # handle technologies and images separately
        m2m_fields = {
            'technologies': validated_data.pop('technologies'),
        }
        updated_instance = super(StudyResourceSerializer, self).update(instance, validated_data)
        updated_instance.studyresourcetechnology_set.all().delete()
        self.handle_m2m_fields(updated_instance, m2m_fields)
        return updated_instance

    def handle_m2m_fields(self, instance, m2m_fields):
        techs = Technology.objects.filter(pk__in=[t['technology_id'] for t in m2m_fields['technologies']])
        for tech in techs:
            tech_post_data = list(filter(lambda t: t['technology_id'] == tech.pk, m2m_fields['technologies']))[0]
            StudyResourceTechnology.objects.create(
                study_resource=instance,
                technology=tech,
                version=tech_post_data['version'],
            )
        if 'images' in m2m_fields:
            for img_data in m2m_fields['images']:
                image = StudyResourceImage(study_resource=instance, image_url=img_data['image_url'])
                image.save()


class ReviewSerializer(serializers.ModelSerializer):
    queryset = Review.objects
    study_resource = StudyResourceSerializer
    author = UserSerializerMinimal(many=False, read_only=True)

    class Meta:
        model = Review
        fields = ['pk', 'author', 'study_resource', 'rating', 'thumbs_up', 'thumbs_down', 'text', 'visible',
                  'created_at', 'updated_at', 'thumbs_up_array', 'thumbs_down_array']


class StudyResourceListingSerializer(serializers.ModelSerializer):
    queryset = StudyResource.objects.all()
    tags = TagSerializerOption(many=True, read_only=True)
    technologies = StudyResourceTechnologySerializer(source='studyresourcetechnology_set', many=True, read_only=True)
    rating = FloatField(read_only=True)
    reviews_count = IntegerField(read_only=True)
    category = CategorySerializerOption()

    class Meta:
        model = StudyResource
        fields = [
            'pk', 'rating', 'reviews_count', 'absolute_url', 'name',
            'price_label', 'media_label', 'experience_level_label',
            'publication_date',
            'tags', 'technologies', 'category',
        ]


class StudyResourceListingMinimalSerializer(serializers.ModelSerializer):
    queryset = StudyResource.objects.all()
    rating = FloatField(read_only=True)
    reviews_count = IntegerField(read_only=True)

    class Meta:
        model = StudyResource
        fields = ['pk', 'rating', 'reviews_count', 'absolute_url', 'name', ]