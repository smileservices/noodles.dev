import requests
import json
from django.shortcuts import render
from django.http.response import JsonResponse
from django.contrib.auth.decorators import login_required
from django.urls import reverse_lazy
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.filters import OrderingFilter, SearchFilter
from core.abstract_viewsets import ResourceWithEditSuggestionVieset, EditSuggestionViewset, SearchableModelViewset
from core.permissions import AuthorOrAdminOrReadOnly, EditSuggestionAuthorOrAdminOrReadOnly
from collections import defaultdict
from study_collection.models import Collection
from study_resource.models import StudyResource
from . import filters
from .serializers import TechnologySerializer, TechnologySerializerOption, TechnologyListing
from .models import Technology


def detail(request, id, slug):
    queryset = Technology.objects
    detail = queryset.get(pk=id)
    # solutions = detail.solutions
    collections = Collection.objects.filter(technologies=detail).all()[:5]
    # similar_techs = []
    # for tech_list in [solution.technologies.all() for solution in solutions.all()]:
    #     similar_techs += tech_list
    resources_ids = [tech['study_resource_id'] for tech in
                     detail.studyresourcetechnology_set.values('study_resource_id').all()]
    resources = StudyResource.objects.filter(pk__in=resources_ids).all()
    latest_resources = StudyResource.objects.all().order_by('created_at')[:5]
    tags = []
    for res in latest_resources:
        [tags.append(tag) for tag in res.tags.all()]
    latest = {
        'tags': set(tags),
        'resources': latest_resources
    }
    data = {
        'result': detail,
        'collections': collections,
        'latest': latest,
        # 'solutions': solutions,
        # 'similar': similar_techs,
        'resources': resources,
        'thumbs_up_array': json.dumps(detail.thumbs_up_array),
        'thumbs_down_array': json.dumps(detail.thumbs_down_array),
        'vote_url': reverse_lazy('techs-viewset-vote', kwargs={'pk': detail.pk}),
    }
    if request.user.is_authenticated:
        return render(request, 'technology/detail_page.html', data)
    return render(request, 'technology/detail_page_seo.html', data)


def list_all(request):
    queryset = Technology.objects.all()
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
    return render(request, 'technology/list_page_seo.html', data)


@login_required
def create(request):
    data = {
        'urls': {
            'tech_api': reverse_lazy('techs-viewset-list'),
            'tech_options_api': reverse_lazy('techs-options-list'),
            'categories_options_api': reverse_lazy('categories-options-list'),
            'license_options': reverse_lazy('license-options'),
        }
    }
    return render(request, 'technology/create_page.html', data)


@login_required
def edit(request, id):
    data = {
        'urls': {
            'resource_detail': reverse_lazy('techs-viewset-detail', kwargs={'pk': id}),
            'resource_api': reverse_lazy('techs-viewset-list'),

            'edit_suggestions_list': reverse_lazy('techs-viewset-edit-suggestions', kwargs={'pk': id}),
            'edit_suggestions_publish': reverse_lazy('techs-viewset-edit-suggestion-publish', kwargs={'pk': id}),
            'edit_suggestions_reject': reverse_lazy('techs-viewset-edit-suggestion-reject', kwargs={'pk': id}),

            'edit_suggestions_api': reverse_lazy('techs-edit-suggestions-viewset-list'),
            'tag_options_api': reverse_lazy('tags-options-list'),
            'tech_options_api': reverse_lazy('techs-options-list'),
            'categories_options_api': reverse_lazy('categories-options-list'),
            'license_options': reverse_lazy('license-options'),
        }
    }
    return render(request, 'technology/edit_page.html', data)


class TechViewset(ResourceWithEditSuggestionVieset, SearchableModelViewset):
    serializer_class = TechnologySerializer
    queryset = TechnologySerializer.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    filter_backends = [SearchFilter, OrderingFilter]
    filterset_class = filters.TechnologyFilterRest
    search_fields = ['name', 'description']

    @action(methods=['GET'], detail=False)
    def filter(self, request, *args, **kwargs):
        queryset = self.queryset
        return self.filtered_response(
            request,
            ['name', 'description'],
            self.filterset_class,
            TechnologyListing,
            queryset
        )

    @action(methods=['POST'], detail=False)
    def validate_url(self, request, *args, **kwargs):
        try:
            url_request = requests.get(request.data['url'])
            if url_request.status_code != 200:
                return Response({
                    'error': True,
                    'message': 'The url is not giving a valid response. Please check it again.'
                })
        except Exception as e:
            return Response({
                'error': True,
                'message': str(e)
            })
        return Response({
            'error': False
        })


def sidebar(request):
    all = Technology.objects.select_related('category').all()
    featured = defaultdict(list)
    other = defaultdict(list)
    techlisting = lambda t: {
        'url': t.absolute_url,
        'logo': t.logo,
        'name': t.name
    }
    for tech in all:
        if tech.featured:
            featured[tech.category.name].append(techlisting(tech))
        else:
            other[tech.category.name].append(techlisting(tech))
    return JsonResponse({'featured': featured, 'other': other})


def license_options(request):
    license = [{'value': o[0], 'label': o[1]} for o in Technology.LicenseType.choices]
    return JsonResponse(license, safe=False)


class TechEditSuggestionViewset(EditSuggestionViewset):
    queryset = Technology.edit_suggestions
    serializer_class = TechnologySerializer.get_edit_suggestion_serializer()
    permission_classes = [EditSuggestionAuthorOrAdminOrReadOnly, ]


class TechViewsetOptions(ModelViewSet):
    serializer_class = TechnologySerializerOption
    queryset = TechnologySerializerOption.queryset
    permission_classes = [IsAuthenticatedOrReadOnly, ]
    pagination_class = None
