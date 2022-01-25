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
from rest_framework import exceptions
from core.abstract_viewsets import ResourceWithEditSuggestionVieset, EditSuggestionViewset
from study_resource.scrape.main import scrape_tutorial
from study_resource import filters
from study_resource.models import StudyResource, StudyResourceIntermediary
from study_resource import serializers
from concepts.serializers_category import CategoryConceptSerializerOption
from concepts.serializers_technology import TechnologyConceptSerializerOption
from django.utils import timezone
import datetime
from core.logging import logger, events
import json
from concepts.models import CategoryConcept, TechnologyConcept
from notifications.tasks import create_notification
from notifications import events as notification_events
from core.permissions import EditSuggestionAuthorOrAdminOrReadOnly
from core.utils import rest_paginate_queryset
from app.settings import rewards
from study_collection.models import Collection


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
        'collections': resource.collections.filter(is_public=True, status=Collection.StatusOptions.APPROVED).all(),
        'MAX_RATING': settings.MAX_RATING,
        'urls': {
            'review_api': reverse_lazy('review-viewset-list'),
            'reviews_list': reverse_lazy('study-resource-viewset-reviews', kwargs={'pk': resource.pk}),
            'subscribe_url': reverse_lazy('study-resource-viewset-subscribe', kwargs={'pk': resource.pk}),
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

    def create(self, request, *args, **kwargs):
        intermediary = StudyResourceIntermediary.objects.filter(url=request.data['url']).get()
        try:
            create_response = super(ResourceWithEditSuggestionVieset, self).create(request, *args, **kwargs)
            if create_response.status_code == 201:
                create_notification(StudyResource, create_response.data['pk'], request.user.pk, notification_events.VERB_CREATE)
                logger.log_study_resource_create(create_response, request)
                # set intermediary status to SAVED
                intermediary.status = StudyResourceIntermediary.Status.SAVED
                intermediary.data = json.dumps(request.data)
                intermediary.save()
                create_response.data['success'] = {
                    'message': f'<div class="message">Thank you for adding a new resource!</div>'
                               f'<div class="score-info">'
                               f'You gained <span className="user-reward">{rewards.RESOURCE_CREATE}</span> points! '
                               f'Your score is now <span className="user-score">{request.user.positive_score}</span>'
                               f'</div>',
                }
                return create_response
            else:
                raise Exception('Cannot save resource')
        except Exception as e:
            # set intermediary status to ERROR
            intermediary.status = StudyResourceIntermediary.Status.ERROR
            intermediary.data = {
                'data': json.dumps(request.data),
                'error': print(e)
            }
            intermediary.save()
            logger.log_resource_error(f'saved intermediary :: {intermediary.url} :: {str(e)}', request, events.OP_CREATE)
            raise Exception(print(e))

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
        queryset = serializers.ResourceReviewSerializer.queryset.filter(
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
        '''
        This endpoint checks if the resource URL is correct and if it already exists
        If the url exists as an intermediary, that record is returned, else, it's created

        Returns an intermediary instance or error if resource already exists
        '''
        queryset = self.queryset
        url = request.data['url']
        if 'pk' in request.data:
            queryset = queryset.only('pk').exclude(pk=request.data['pk'])
        if queryset.filter(url=url).count() > 0:
            return Response({
                'error': True,
                'message': 'Resource with the same url already exists.'
            })
        elif 'pk' in request.data:
            # if we just update a resource, we don't crawl the resource
            return Response({
                'error': False,
            })
        try:
            # we check for intermediary resource, if exists, we return it
            intermediary = StudyResourceIntermediary.objects.filter(url=url).get()
            time_difference = timezone.now() - intermediary.active
            # if the status is 0 and active is less than 10 minutes, we raise exception
            if intermediary.author == request.user:
                # initial user that tried adding the resource resets the active counter
                intermediary.active = timezone.now()
                intermediary.save()
            elif intermediary.status == StudyResourceIntermediary.Status.PENDING and time_difference < datetime.timedelta(
                    minutes=5):
                wait = datetime.timedelta(minutes=5) - time_difference
                wait_minutes = round(wait.total_seconds() / 60, 1)
                raise Exception(
                    f'Someone else is adding this resource. '
                    f'Please try a new URL or wait for {wait_minutes} minutes '
                    f'before trying again.'
                )
            elif time_difference > datetime.timedelta(minutes=5):
                # update the intermediary
                intermediary.active = timezone.now()
                intermediary.author = request.user
                intermediary.save()
        except StudyResourceIntermediary.DoesNotExist:
            intermediary = StudyResourceIntermediary.objects.create(
                url=url,
                active=timezone.now(),
                author=request.user,
                status=StudyResourceIntermediary.Status.PENDING,
            )
            intermediary.scraped_data = scrape_tutorial(url)
            intermediary.save()
        except Exception as e:
            return Response({
                'error': True,
                'message': str(e)
            })
        return Response(
            serializers.StudyResourceIntermediarySerializer(intermediary).data
        )

    @action(methods=['GET'], detail=False)
    def options(self, request, *args, **kwargs):

        return Response({
            'price': [{'value': c[0], 'label': c[1]} for c in StudyResource.Price.choices],
            'media': [{'value': c[0], 'label': c[1]} for c in StudyResource.Media.choices],
            'experience_level': [{'value': c[0], 'label': c[1]} for c in StudyResource.ExperienceLevel.choices],
            'category_concepts': [CategoryConceptSerializerOption(c).data for c in CategoryConcept.objects.all()],
            'technology_concepts': [TechnologyConceptSerializerOption(c).data for c in TechnologyConcept.objects.all()]
        })

    @action(methods=['GET'], detail=False)
    def no_reviews(self, request, *args, **kwargs):
        queryset = self.queryset.filter(reviews_count=0, status=self.serializer_class.Meta.model.StatusOptions.APPROVED)
        return rest_paginate_queryset(self, queryset)


class StudyResourceEditSuggestionViewset(EditSuggestionViewset):
    serializer_class = serializers.StudyResourceEditSuggestionSerializer
    queryset = serializers.StudyResourceEditSuggestionSerializer.queryset
    permission_classes = [EditSuggestionAuthorOrAdminOrReadOnly, ]
