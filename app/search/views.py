from django.http.response import JsonResponse
from django.shortcuts import render
from core.elasticsearch.elasticsearch_interface import ElasticSearchInterface


def autocomplete(request, prefix):
    es = ElasticSearchInterface(['collections', 'study_resources', 'technologies'])
    records = es.suggest(prefix)
    return JsonResponse(records, safe=False)


def _search_study_resources(term, filter, page, page_size):
    es_res = ElasticSearchInterface(['study_resources'])
    resources_fields = ['name', 'summary', 'category', 'technologies', 'tags']
    results = es_res.search(
        fields=resources_fields,
        term=term,
        filter=filter,
        page=page,
        page_size=page_size
    )
    return results


def _search_collections(term, filter, page, page_size):
    es_res = ElasticSearchInterface(['collections'])
    collections_fields = ['name', 'description', 'technologies', 'tags']
    results = es_res.search(
        fields=collections_fields,
        term=term,
        filter=filter,
        page=page,
        page_size=page_size
    )
    return results


def _search_technologies(term, filter, page, page_size):
    es_res = ElasticSearchInterface(['technologies'])
    technologies_fields = ['name', 'description', 'technologies', 'tags']
    results = es_res.search(
        fields=technologies_fields,
        term=term,
        filter=filter,
        page=page,
        page_size=page_size
    )
    return results


# def search_all(request, term):
#     page = request.GET.get('page', 0)
#     page_size = request.GET.get('page_size', 10)
#     unified_results = {
#         'study_resources': _search_study_resources(term, page, page_size),
#         'collections': _search_collections(term, page, page_size),
#         'technologies': _search_technologies(term, page, page_size),
#     }
#     return JsonResponse(unified_results, safe=False)


def search_specific(request, index):
    term = request.GET.get('search', '')
    page = int(request.GET.get('offset', 0))
    page_size = int(request.GET.get('limit', 10))
    filter = extract_filters(request)
    if index == 'resources':
        results = _search_study_resources(term, filter, page, page_size)
    elif index == 'collections':
        results = _search_collections(term, filter, page, page_size)
    elif index == 'technologies':
        results = _search_technologies(term, filter, page, page_size)
    else:
        results = f'{index} does not exist'
    return JsonResponse(results, safe=False)


def extract_filters(request) -> []:
    # We cycle through each possible parameters
    # http://127.0.0.1:8000/search/api/study_resources?q=create&tech_v=python|gte:2.1&tech_v=laravel&category=dev%20ops&page=1&page_size=5
    filter = []
    for param in request.GET.keys():
        if param in ['category', 'price', 'media', 'experience_level']:
            filter.append({
                "term": {param: request.GET.get(param)}
            })
        elif param in ['tech', 'tag']:
            param_name = param
            if param == 'tech':
                param_name = 'technologies'
            elif param == 'tag':
                param_name = 'tags'
            for value in request.GET.getlist(param):
                filter.append({
                    "term": {param_name: value}
                })
        elif param in ['publication_date', 'rating', 'reviews_count', 'votes_up', 'votes_down',
                       'edit_suggestions_count']:
            val_arr = request.GET.get(param).split('~')
            p_filter = {
                "operator": val_arr[0],
                "value": val_arr[1]
            }
            filter.append({
                "range": {param: {p_filter['operator']: p_filter['value']}}
            })
        elif param in ['tech_v']:
            techs_arr = request.GET.getlist(param)
            for tech_string in techs_arr:
                tech_arr = tech_string.split('|')
                tech_filter_item = {
                    "name": tech_arr[0]
                }
                p_filter = {
                    "nested": {"path": "technologies",
                               "query": {
                                   "bool": {
                                       "must": {
                                           "match": {
                                               "technologies.name": tech_filter_item["name"]
                                           }
                                       },
                                       "filter": []
                                   }
                               }
                               }
                }
                if len(tech_arr) > 1:
                    version_arr = tech_arr[1].split(':')
                    p_filter["nested"]["query"]["bool"]["filter"].append(
                        {"range": {"technologies.version": {version_arr[0]: float(version_arr[1])}}}
                    )
                    filter.append(p_filter)
    return filter


def search_page(request):
    data = {
        'hide_navbar_search': True,
        'search_resources_url': '/search/api/study_resources/',
        'search_collections_url': '/search/api/collections/',
        'search_technologies_url': '/search/api/technologies/',
    }
    return render(request, 'search/main.html', data)
