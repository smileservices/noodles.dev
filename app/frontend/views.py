from django.shortcuts import render
from study_resource.models import StudyResource
from technology.models import Technology
from study_collection.models import Collection
from django.http.response import JsonResponse
from core.elasticsearch.elasticsearch_interface import ElasticSearchInterface


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
    es = ElasticSearchInterface(['study_resources'])
    aggregates_results = es.aggregates({
        "price": {"terms": {"field": "price"}},
        "media": {"terms": {"field": "media"}},
        "experience_level": {"terms": {"field": "experience_level"}},
        "technologies": {"terms": {"field": "technologies.name"}},
        "tags": {"terms": {"field": "tags", "size": 20}},
        "category": {"terms": {"field": "category"}},
    })
    rating_sort = [{"rating": {"order": "desc", "missing": "_last", "unmapped_type": "long"}}, {"reviews": {"order": "desc", "missing": "_last", "unmapped_type": "long"}}]
    data = {
        'all_filters': aggregates_results,
        'rated_highest': es.sort_by(rating_sort, page_size=5)
    }
    return JsonResponse(data)


def homepage_collections(request):
    es = ElasticSearchInterface(['collections'])
    aggregates_results = es.aggregates({
        "technologies": {"terms": {"field": "technologies"}},
        "tags": {"terms": {"field": "tags", "size": 20}},
    })
    votes_sort = [{"thumbs_up": {"order": "desc", "missing": "_last", "unmapped_type": "long"}},]
    data = {
        'all_filters': aggregates_results,
        'rated_highest': es.sort_by(votes_sort, page_size=4),
        'latest': es.latest(page_size=3)
    }
    return JsonResponse(data)


def homepage_technologies(request):
    es = ElasticSearchInterface(['technologies'])
    aggregates_results = es.aggregates({
        "ecosystem": {"terms": {"field": "ecosystem", "size": 20}},
        "category": {"terms": {"field": "category"}},
    })
    votes_sort = [{"thumbs_up": {"order": "desc", "missing": "_last", "unmapped_type": "long"}},]
    data = {
        'all_filters': aggregates_results,
        'rated_highest': es.sort_by(votes_sort, page_size=4),
        'latest': es.latest(page_size=3)
    }
    return JsonResponse(data)
