import json
from django.http.response import JsonResponse
from django.shortcuts import render
from core.elasticsearch.elasticsearch_interface import ElasticSearchInterface
from elasticsearch import exceptions as es_ex
from django.views.decorators.cache import cache_page
from .helpers import _search_aggr_collections, _search_aggr_study_resources, _search_aggr_technologies, extract_filters


def autocomplete(request, prefix):
    es = ElasticSearchInterface(['collections', 'study_resources', 'technologies'])
    records = es.suggest(prefix)
    return JsonResponse(records, safe=False)


def search_specific(request, index):
    term = request.GET.get('search', '')
    page_size = int(request.GET.get('resultsPerPage', 10))
    offset_results = int(request.GET.get('offset', 0))
    page = 0 if not offset_results else offset_results / page_size;
    filter = extract_filters(request)
    if index == 'resources':
        results = _search_aggr_study_resources(term, filter, page, page_size)
    elif index == 'collections':
        results = _search_aggr_collections(term, filter, page, page_size)
    elif index == 'technologies':
        results = _search_aggr_technologies(term, filter, page, page_size)
    else:
        results = f'{index} does not exist'
    return JsonResponse(results, safe=False)


def search_page(request):
    data = {
        'hide_navbar_search': True,
        'search_resources_url': '/search/api/study_resources/',
        'search_collections_url': '/search/api/collections/',
        'search_technologies_url': '/search/api/technologies/',
    }
    return render(request, 'search/main.html', data)


@cache_page(60 * 5)
def related_data(request):
    try:
        es = ElasticSearchInterface(['study_resources'])
        aggregates_results = es.aggregates({
            "technologies": {"terms": {"field": "technologies.name", "size": 10}},
            "tags": {"terms": {"field": "tags", "size": 10}},
        })
        data = {
            'aggregations': aggregates_results,
            'resources': es.latest(page_size=5)
        }
    except es_ex.NotFoundError as e:
        return JsonResponse(data={
            'error': 'ElasticSearch Error: Index study_resources not found'
        }, status=500)
    return JsonResponse(data)
