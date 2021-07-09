from django.shortcuts import render
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.conf import settings
from django.urls import reverse_lazy
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from rest_framework.filters import OrderingFilter
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from core.abstract_viewsets import ResourceWithEditSuggestionVieset, EditSuggestionViewset
from study_resource.scrape.main import scrape_tutorial
from study_resource import filters
from study_resource.models import StudyResource
from study_resource import serializers
from concepts.serializers_category import CategoryConceptSerializerOption
from concepts.serializers_technology import TechnologyConceptSerializerOption

from concepts.models import CategoryConcept, TechnologyConcept

from core.permissions import EditSuggestionAuthorOrAdminOrReadOnly
from app.settings import rewards


def list_all(request):
    queryset = StudyResource.objects.all()
    paginator = Paginator(queryset, 10)
    try:
        results = paginator.page(request.GET.get('page', 1))
    except PageNotAnInteger:
        results = paginator.page(1)
    except EmptyPage:
        results = paginator.page(paginator.num_pages)
    data = {
        'paginator': paginator,
        'results': results,
    }
    return render(request, 'study_resource/list_page_seo.html', data)


def detail(request, id, slug):
    queryset = StudyResource.objects
    resource = queryset.select_related().get(pk=id)
    data = {
        'result': resource,
        'MAX_RATING': settings.MAX_RATING,
        'urls': {
            'review_api': reverse_lazy('review-viewset-list'),
            'reviews_list': reverse_lazy('study-resource-viewset-reviews', kwargs={'pk': resource.pk}),
            # options
            'study_resource_options': reverse_lazy('study-resource-viewset-options'),
            'tag_options_api': reverse_lazy('tags-options-list'),
            'tech_options_api': reverse_lazy('techs-options-list'),
            # collections urls
            'collections_api': reverse_lazy('collection-viewset-list'),
            'user_collections_list': reverse_lazy('collection-viewset-owned'),
            'user_collections_with_resource': f"{reverse_lazy('collection-viewset-owned-with-resource')}?pk={resource.pk}",
            'user_collections_set_resource_to_collections': reverse_lazy(
                'collection-viewset-set-resource-to-collections'),
        }
    }
    if request.user_agent.is_bot:
        return render(request, 'study_resource/detail_page_seo.html', data)
    return render(request, 'study_resource/detail_page.html', data)


def history(request, slug):
    instance = get_object_or_404(StudyResource, slug=slug)
    data = {
        'instance': instance,
        'data': {
            'title': f'History of {instance.name} Resource',
            'breadcrumbs': f'<a href="/">Homepage</a> / Resource <a href="{instance.absolute_url}">{instance.name}</a>',
        },
        'urls': {
            'history_get': reverse_lazy('study-resource-viewset-history', kwargs={'pk': instance.pk}),
        }
    }
    return render(request, 'history/history_page.html', data)


@login_required
def edit(request, id):
    data = {
        'urls': {
            'resource_detail': reverse_lazy('study-resource-viewset-detail', kwargs={'pk': id}),
            'edit_suggestions_list': reverse_lazy('study-resource-viewset-edit-suggestions', kwargs={'pk': id}),
            'edit_suggestions_publish': reverse_lazy('study-resource-viewset-edit-suggestion-publish',
                                                     kwargs={'pk': id}),
            'edit_suggestions_reject': reverse_lazy('study-resource-viewset-edit-suggestion-reject', kwargs={'pk': id}),

            'edit_suggestions_api': reverse_lazy('study-resource-edit-suggestions-viewset-list'),
            'resource_api': reverse_lazy('study-resource-viewset-list'),
            'tag_options_api': reverse_lazy('tags-options-list'),
            'tech_options_api': reverse_lazy('techs-options-list'),
            'tech_api': reverse_lazy('techs-viewset-list'),
            'categories_options_api': reverse_lazy('categories-options-list'),
        }
    }
    return render(request, 'study_resource/edit_page.html', data)


@login_required
def create(request):
    data = {
        'data': {
            'reward': rewards.RESOURCE_CREATE
        },
        'urls': {
            'study_resource_api': reverse_lazy('study-resource-viewset-list'),
            'tag_options_api': reverse_lazy('tags-options-list'),
            'tech_options_api': reverse_lazy('techs-options-list'),
            'tech_api': reverse_lazy('techs-viewset-list'),
            'categories_options_api': reverse_lazy('categories-options-list'),
        }
    }
    return render(request, 'study_resource/create_page.html', data)


class StudyResourceViewset(ResourceWithEditSuggestionVieset):
    serializer_class = serializers.StudyResourceSerializer
    queryset = serializers.StudyResourceSerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = filters.StudyResourceFilterRest
    search_fields = ['name', 'summary', 'published_by', 'tags__name', 'technologies__name']

    # technologies and tags are saved in the serializer
    def edit_suggestion_handle_m2m_through_field(self, instance, data, f):
        # overriding the edit_suggestion method to handle technologies
        '''
            handles data of through in this format:
            [{
                'pk': {{child pk}},
                ...extra fields
            },]

            instance  edit suggestion instance
            f         tracked field information (the one supplied in the models when setting up edit suggestion)
        '''
        m2m_field = getattr(instance, f['name'])
        through_data = data[f['name']]
        m2m_objects_id_list = [o['technology_id'] for o in through_data]
        m2m_objects = [obj for obj in f['model'].objects.filter(pk__in=m2m_objects_id_list)]
        for idx, m2m_obj in enumerate(m2m_objects):
            data = through_data[idx]
            data[f['through']['self_field']] = instance
            data[f['through']['rel_field']] = m2m_obj
            if f['name'] == 'technologies':
                data['name'] = m2m_obj.name
            del data['technology_id']
            m2m_field.through.objects.create(**data)

    @action(methods=['GET'], detail=True)
    def reviews(self, request, *args, **kwargs):
        queryset = serializers.ReviewSerializer.queryset.filter(
            study_resource=self.kwargs['pk']
        ).order_by('-created_at')
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = serializers.ReviewSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = serializers.ReviewSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['POST'], detail=False)
    def validate_url(self, request, *args, **kwargs):
        queryset = self.queryset
        url = request.data['url'].split('?')[0]
        if 'pk' in request.data:
            queryset = queryset.only('pk').exclude(pk=request.data['pk'])
        try:
            queryset.get(url=url)
            return Response({
                'error': True,
                'message': 'Resource with the same url already exists.'
            })
        except StudyResource.DoesNotExist:
            try:
                result = scrape_tutorial(url)
                return Response(result)
            except Exception as e:
                return Response({
                    'error': True,
                    'message': str(e)
                })

    @action(methods=['GET'], detail=False)
    def options(self, request, *args, **kwargs):

        return Response({
            'price': [{'value': c[0], 'label': c[1]} for c in StudyResource.Price.choices],
            'media': [{'value': c[0], 'label': c[1]} for c in StudyResource.Media.choices],
            'experience_level': [{'value': c[0], 'label': c[1]} for c in StudyResource.ExperienceLevel.choices],
            'category_concepts': [CategoryConceptSerializerOption(c).data for c in CategoryConcept.objects.all()],
            'technology_concepts': [TechnologyConceptSerializerOption(c).data for c in TechnologyConcept.objects.all()]
        })
    #
    # def get_success_headers(self, data):
    #     return {'Location': reverse_lazy('study-resource-detail', kwargs={'id': data['pk'], 'slug': data['slug']})}


class StudyResourceEditSuggestionViewset(EditSuggestionViewset):
    serializer_class = serializers.StudyResourceEditSuggestionSerializer
    queryset = serializers.StudyResourceEditSuggestionSerializer.queryset
    permission_classes = [EditSuggestionAuthorOrAdminOrReadOnly, ]
