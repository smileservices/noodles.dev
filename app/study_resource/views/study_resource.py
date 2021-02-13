from django.shortcuts import render
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from django.conf import settings
from django.urls import reverse_lazy
from django.contrib.auth.decorators import login_required

from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.exceptions import PermissionDenied
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from core.abstract_viewsets import ResourceWithEditSuggestionVieset, EditSuggestionViewset, SearchableModelViewset
from study_resource.scrape.main import scrape_tutorial
from study_resource import filters
from study_resource.models import StudyResource, StudyResourceImage
from study_resource import serializers

from core.permissions import AuthorOrAdminOrReadOnly, EditSuggestionAuthorOrAdminOrReadOnly


def search(request):
    queryset = StudyResource.objects.order_by_rating_then_publishing_date()
    filtered = filters.StudyResourceFilterMatches(request.GET, queryset=queryset)
    user_query_term = filtered.data["contains"] if "contains" in filtered.data else "your query"
    message = f'Found {filtered.qs.count()} results matching "{user_query_term}"'
    if filtered.qs.count() == 0:
        filtered = filters.StudyResourceFilterSimilar(request.GET, queryset=queryset)
        if filtered.qs.count() > 0:
            message = f'Found {filtered.qs.count()} results similar to "{user_query_term}"'
        else:
            message = f'Count not find any results matching or similar to "{user_query_term}"'
    paginator = Paginator(filtered.qs, 10)
    try:
        results = paginator.page(request.GET.get('page', 1))
    except PageNotAnInteger:
        results = paginator.page(1)
    except EmptyPage:
        results = paginator.page(paginator.num_pages)
    data = {
        'message': message,
        'filter': filtered,
        'paginator': paginator,
        'results': results,
    }
    return render(request, 'study_resource/search_page.html', data)


def detail(request, id, slug):
    queryset = StudyResource.objects
    resource = queryset.get(pk=id)
    collections = resource.collections.all()[:5]
    related = queryset.filter(
        Q(tags__in=resource.tags.all()),
        Q(technologies__in=resource.technologies.all()),
        ~Q(id=resource.id)
    ).order_by_rating_then_publishing_date()[:5]
    data = {
        'result': resource,
        'collections': collections,
        'related': related,
        'reviews': resource.reviews.order_by('-created_at').all(),
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
    if request.user.is_authenticated:
        return render(request, 'study_resource/detail_page.html', data)
    return render(request, 'study_resource/detail_page_seo.html', data)


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
        'urls': {
            'study_resource_api': reverse_lazy('study-resource-viewset-list'),
            'tag_options_api': reverse_lazy('tags-options-list'),
            'tech_options_api': reverse_lazy('techs-options-list'),
            'tech_api': reverse_lazy('techs-viewset-list'),
            'categories_options_api': reverse_lazy('categories-options-list'),
        }
    }
    return render(request, 'study_resource/create_page.html', data)


class StudyResourceViewset(ResourceWithEditSuggestionVieset, SearchableModelViewset):
    serializer_class = serializers.StudyResourceSerializer
    queryset = serializers.StudyResourceSerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = filters.StudyResourceFilterRest
    search_fields = ['name', 'summary', 'published_by', 'tags__name', 'technologies__name']

    @action(methods=['GET'], detail=False)
    def filter(self, request, *args, **kwargs):
        queryset = self.queryset
        return self.filtered_response(
            request, ['name', 'summary'],
            self.filterset_class,
            serializers.StudyResourceListingSerializer,
            queryset
        )


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
        if 'pk' in request.data:
            queryset = queryset.only('pk').exclude(pk=request.data['pk'])
        try:
            queryset.get(url=request.data['url'])
            return Response({
                'error': True,
                'message': 'Resource with the same url already exists.'
            })
        except StudyResource.DoesNotExist:
            try:
                result = scrape_tutorial(request.data['url'])
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
            'experience_level': [{'value': c[0], 'label': c[1]} for c in StudyResource.ExperienceLevel.choices]
        })
    #
    # def get_success_headers(self, data):
    #     return {'Location': reverse_lazy('study-resource-detail', kwargs={'id': data['pk'], 'slug': data['slug']})}


class StudyResourceEditSuggestionViewset(EditSuggestionViewset):
    serializer_class = serializers.StudyResourceEditSuggestionSerializer
    queryset = serializers.StudyResourceEditSuggestionSerializer.queryset
    permission_classes = [EditSuggestionAuthorOrAdminOrReadOnly, ]
