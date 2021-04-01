from django.shortcuts import render
from study_resource.models import StudyResource
from technology.models import Technology
from study_collection.models import Collection
from django.http.response import JsonResponse
from core.elasticsearch.elasticsearch_interface import ElasticSearchInterface
from elasticsearch import exceptions as es_ex
from collections import defaultdict
from django.views.decorators.cache import cache_page


def homepage(request):
    return render(request, 'frontend/homepage.html')


@cache_page(60)
def aggregations(request):
    # return total number of items
    data = {
        'study_resources': StudyResource.objects.count(),
        'collections': Collection.objects.filter(is_public=True).count(),
        'technologies': Technology.objects.count(),
    }
    return JsonResponse(data)


@cache_page(60)
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


@cache_page(60)
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


# @cache_page(60)
def homepage_technologies(request):
    try:
        es = ElasticSearchInterface(['technologies'])
        aggregates_results = es.aggregates({
            "license": {"terms": {"field": "license", "size": 10}},
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


@cache_page(60 * 5)
def sidebar(request):
    all = Technology.objects.select_related().all()
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


@cache_page(60*60*24)
def error_404(request, exception):
    from django.views.defaults import page_not_found
    return page_not_found(request, exception, template_name='errors/404.html')


@cache_page(60*60*24)
def error_500(request):
    from django.views.defaults import server_error
    return server_error(request, template_name='errors/500.html')
