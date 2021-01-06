from rest_framework import serializers
from rest_framework.fields import FloatField, IntegerField
from .models import StudyResource, Review, Collection, StudyResourceImage, StudyResourceTechnology
from users.serializers import UserSerializerMinimal
from django.template.defaultfilters import slugify
from versatileimagefield.serializers import VersatileImageFieldSerializer
from django.conf import settings
from django_edit_suggestion.rest_serializers import EditSuggestionSerializer
from tag.serializers import TagSerializer, TagSerializerOption
from tag.models import Tag
from technology.serializers import TechnologySerializer, TechnologySerializerOption
from technology.models import Technology
from django.urls import reverse_lazy


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
    author = UserSerializerMinimal(many=False, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    technologies = StudyResourceTechnologySerializer(source='studyresourcetechnology_set', many=True, read_only=True)
    edit_suggestion_author = UserSerializerMinimal(read_only=True)
    changes = serializers.SerializerMethodField()

    # handling images for edit suggestions is a todo
    # images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = StudyResource.edit_suggestions.model
        fields = ['pk', 'name', 'slug', 'url', 'summary', 'price', 'media',
                  'experience_level', 'author', 'tags',
                  'technologies', 'published_by',
                  'edit_suggestion_reason', 'edit_suggestion_author', 'edit_suggestion_date_created', 'changes',
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
            else:
                result.append({'field': change.field.capitalize(), 'old': change.old, 'new': change.new})
        return result

    # def run_validation(self, data):
    #     if 'slug' not in data:
    #         data['slug'] = slugify(data['name'])
    #     validated_data = super().run_validation(data)
    #     validated_data['tags'] = Tag.objects.validate_tags(data['tags'])
    #     validated_data['images'] = data['images'] if 'images' in data else []
    #     return validated_data
    #
    # def create(self, validated_data):
    #     # handle technologies and images separately
    #     m2m_fields = {
    #         'technologies': validated_data.pop('technologies'),
    #         'images': validated_data.pop('images'),
    #     }
    #     study_resource = super(StudyResourceEditSuggestionSerializer, self).create(validated_data)
    #     techs = Technology.objects.filter(pk__in=[t['pk'] for t in m2m_fields['technologies']])
    #     for tech in techs:
    #         tech_post_data = list(filter(lambda t: t['pk'] == tech.pk, m2m_fields['technologies']))[0]
    #         StudyResourceTechnology.objects.create(
    #             study_resource=study_resource,
    #             technology=tech,
    #             version=tech_post_data['version'],
    #         )
    #     # for img_data in m2m_fields['images']:
    #     #     image = StudyResourceImage(study_resource=study_resource, image_url=img_data['url'])
    #     #     image.save()
    #     return study_resource


class StudyResourceSerializer(EditSuggestionSerializer):
    queryset = StudyResource.objects.all()
    author = UserSerializerMinimal(many=False, read_only=True)
    tags = TagSerializerOption(many=True, read_only=True)
    technologies = StudyResourceTechnologySerializer(source='studyresourcetechnology_set', many=True, read_only=True)
    rating = FloatField(read_only=True)
    reviews_count = IntegerField(read_only=True)
    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = StudyResource
        fields = ['pk', 'rating', 'reviews_count', 'absolute_url', 'name', 'slug', 'url', 'summary', 'price', 'media',
                  'experience_level', 'author', 'tags',
                  'technologies', 'created_at', 'updated_at', 'publication_date', 'published_by', 'images']

    @staticmethod
    def get_edit_suggestion_serializer():
        return StudyResourceEditSuggestionSerializer

    @staticmethod
    def get_edit_suggestion_listing_serializer():
        return StudyResourceEditSuggestionListingSerializer

    def run_validation(self, data):
        if 'slug' not in data:
            data['slug'] = slugify(data['name'])
        validated_data = super().run_validation(data)
        validated_data['tags'] = Tag.objects.validate_tags(data['tags'])
        # validate technologies, images
        techs = []
        for tech in data['technologies']:
            if tech['pk'] in techs:
                raise AttributeError('Cannot add same technology multiple times')
            techs.append(tech['pk'])
        validated_data['technologies'] = data['technologies']
        validated_data['images'] = data['images'] if 'images' in data else []
        return validated_data

    def create(self, validated_data):
        # handle technologies and images separately
        m2m_fields = {
            'technologies': validated_data.pop('technologies'),
            'images': validated_data.pop('images'),
        }
        study_resource = super(StudyResourceSerializer, self).create(validated_data)
        techs = Technology.objects.filter(pk__in=[t['pk'] for t in m2m_fields['technologies']])
        for tech in techs:
            tech_post_data = list(filter(lambda t: t['pk'] == tech.pk, m2m_fields['technologies']))[0]
            StudyResourceTechnology.objects.create(
                study_resource=study_resource,
                technology=tech,
                version=tech_post_data['version'],
            )
        for img_data in m2m_fields['images']:
            image = StudyResourceImage(study_resource=study_resource, image_url=img_data['url'])
            image.save()
        return study_resource

    def update(self, instance, validated_data):
        # handle technologies and images separately
        m2m_fields = {
            'technologies': validated_data.pop('technologies'),
            'images': validated_data.pop('images'),
        }
        updated_instance = super(StudyResourceSerializer, self).update(instance, validated_data)
        updated_instance.studyresourcetechnology_set.all().delete()
        updated_instance.images.all().delete()

        techs = Technology.objects.filter(pk__in=[t['pk'] for t in m2m_fields['technologies']])
        for tech in techs:
            tech_post_data = list(filter(lambda t: t['pk'] == tech.pk, m2m_fields['technologies']))[0]
            StudyResourceTechnology.objects.create(
                study_resource=updated_instance,
                technology=tech,
                version=tech_post_data['version'],
            )
        for img_data in m2m_fields['images']:
            image = StudyResourceImage(study_resource=instance, image_url=img_data['url'])
            image.save()
        return updated_instance


class ReviewSerializer(serializers.ModelSerializer):
    queryset = Review.objects
    study_resource = StudyResourceSerializer
    author = UserSerializerMinimal(many=False, read_only=True)

    class Meta:
        model = Review
        fields = ['pk', 'author', 'study_resource', 'rating', 'thumbs_up', 'thumbs_down', 'text', 'visible',
                  'created_at', 'updated_at', 'thumbs_up_array', 'thumbs_down_array']


class CollectionSerializer(serializers.ModelSerializer):
    queryset = Collection.objects
    author = UserSerializerMinimal(many=False, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    technologies = TechnologySerializerOption(many=True, read_only=True)
    items_count = IntegerField(read_only=True)

    class Meta:
        model = Collection
        fields = ['pk', 'name', 'description', 'created_at', 'author', 'tags', 'technologies', 'items_count']

    def run_validation(self, data):
        validated_data = super(CollectionSerializer, self).run_validation(data)
        validated_data['tags'] = Tag.objects.validate_tags(data['tags'])
        validated_data['technologies'] = data['technologies']
        if 'resources' in data:
            validated_data['resources'] = data['resources']
        return validated_data
