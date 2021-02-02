from django.http.response import JsonResponse
from core.elasticsearch.elasticsearch_interface import ElasticSearchInterface


def autocomplete(request, prefix):
    es = ElasticSearchInterface(['collections', 'study_resources', 'technologies'])
    records = es.suggest(prefix)
    return JsonResponse(records, safe=False)


def _search_study_resources(term, page, page_size):
    es_res = ElasticSearchInterface(['study_resources'])
    resources_fields = ['name', 'summary', 'category', 'technologies', 'tags']
    results = es_res.search(
        fields=resources_fields,
        term=term,
        page=page,
        page_size=page_size
    )
    return results


def _search_collections(term, page, page_size):
    es_res = ElasticSearchInterface(['collections'])
    collections_fields = ['name', 'description', 'technologies', 'tags']
    results = es_res.search(
        fields=collections_fields,
        term=term,
        page=page,
        page_size=page_size
    )
    return results


def _search_technologies(term, page, page_size):
    es_res = ElasticSearchInterface(['technologies'])
    technologies_fields = ['name', 'description', 'technologies', 'tags']
    results = es_res.search(
        fields=technologies_fields,
        term=term,
        page=page,
        page_size=page_size
    )
    return results


def search_all(request, term):
    page = request.GET.get('page', 0)
    page_size = request.GET.get('page_size', 10)
    unified_results = {
        'study_resources': _search_study_resources(term, page, page_size),
        'collections': _search_collections(term, page, page_size),
        'technologies': _search_technologies(term, page, page_size),
    }
    return JsonResponse(unified_results, safe=False)


def search_specific(request, index, term):
    page = request.GET.get('page', 0)
    page_size = request.GET.get('page_size', 10)
    if index == 'study_resources':
        results = _search_study_resources(term, page, page_size)
    elif index == 'collections':
        results = _search_collections(term, page, page_size)
    elif index == 'technologies':
        results = _search_technologies(term, page, page_size)
    else:
        results = f'{index} does not exist'
    return JsonResponse(results, safe=False)
