from django.shortcuts import render
from study_resource.models import StudyResource
from technology.models import Technology
from study_collection.models import Collection
from django.http.response import JsonResponse
from core.elasticsearch.elasticsearch_interface import ElasticSearchInterface
from elasticsearch import exceptions as es_ex
from collections import defaultdict


def homepage(request):
    return render(request, 'frontend/homepage.html')


def aggregations(request):
    # return total number of items
    data = {
        'study_resources': StudyResource.objects.count(),
        'collections': Collection.objects.filter(is_public=True).count(),
        'technologies': Technology.objects.count(),
    }
    return JsonResponse(data)


def homepage_resources(request):
    try:
        es = ElasticSearchInterface(['study_resources'])
        aggregates_results = es.aggregates({
            "price": {"terms": {"field": "price"}},
            "media": {"terms": {"field": "media"}},
            "experience_level": {"terms": {"field": "experience_level"}},
            "technologies": {"terms": {"field": "technologies.name"}},
            "tags": {"terms": {"field": "tags", "size": 20}},
            "category": {"terms": {"field": "category"}},
        })
        rating_sort = [{"rating": {"order": "desc", "missing": "_last", "unmapped_type": "long"}},
                       {"reviews": {"order": "desc", "missing": "_last", "unmapped_type": "long"}}]
        data = {
            'all_filters': aggregates_results,
            'rated_highest': es.sort_by(rating_sort, page_size=5)
        }
    except es_ex.NotFoundError as e:
        return JsonResponse(data={
            'error': 'ElasticSearch Error: Index study_resources not found'
        }, status=500)
    return JsonResponse(data)


def homepage_collections(request):
    try:
        es = ElasticSearchInterface(['collections'])
        aggregates_results = es.aggregates({
            "technologies": {"terms": {"field": "technologies"}},
            "tags": {"terms": {"field": "tags", "size": 20}},
        })
        votes_sort = [{"thumbs_up": {"order": "desc", "missing": "_last", "unmapped_type": "long"}}, ]
        data = {
            'all_filters': aggregates_results,
            'rated_highest': es.sort_by(votes_sort, page_size=4),
            'latest': es.latest(page_size=3)
        }
    except es_ex.NotFoundError as e:
        return JsonResponse(data={
            'error': 'ElasticSearch Error: Index collections not found'
        }, status=500)
    return JsonResponse(data)


def homepage_technologies(request):
    try:
        es = ElasticSearchInterface(['technologies'])
        aggregates_results = es.aggregates({
            "ecosystem": {"terms": {"field": "ecosystem", "size": 20}},
            "category": {"terms": {"field": "category"}},
        })
        votes_sort = [{"thumbs_up": {"order": "desc", "missing": "_last", "unmapped_type": "long"}}, ]
        data = {
            'all_filters': aggregates_results,
            'rated_highest': es.sort_by(votes_sort, page_size=4),
            'latest': es.latest(page_size=3)
        }
    except es_ex.NotFoundError as e:
        return JsonResponse(data={
            'error': 'ElasticSearch Error: Index technologies not found'
        }, status=500)
    return JsonResponse(data)


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
