from core.elasticsearch.elasticsearch_interface import ElasticSearchInterface


def _search_aggr_categories(term, sort, filter, page, page_size):
    es_res = ElasticSearchInterface(['categories'])
    fields = ['name^4', 'description', 'parent']
    aggregates = {
        "parent": {"terms": {"field": "parent", "size": 10}},
    }
    results = es_res.search(
        fields=fields,
        term=term,
        filter=filter,
        sort=sort,
        aggregates=aggregates,
        page=page,
        page_size=page_size
    )
    results['sort'] = [
        {"value": "default", "label": "Relevance"},
    ]
    return results


def _search_aggr_concepts_category(term, sort, filter, page, page_size):
    es_res = ElasticSearchInterface(['category_concepts'])
    fields = ['name^4', 'description', 'parent', 'experience_level']
    aggregates = {
        "parent": {"terms": {"field": "parent", "size": 10}},
    }
    results = es_res.search(
        fields=fields,
        term=term,
        filter=filter,
        sort=sort,
        aggregates=aggregates,
        page=page,
        page_size=page_size
    )
    results['sort'] = [
        {"value": "default", "label": "Relevance"},
        {"value": "experience_level", "label": "Experience Level"},
    ]
    return results


def _search_aggr_concepts_technology(term, sort, filter, page, page_size):
    es_res = ElasticSearchInterface(['technology_concepts'])
    fields = ['name^4', 'description', 'parent', 'experience_level', 'technology']
    aggregates = {
        "parent": {"terms": {"field": "parent", "size": 10}},
    }
    results = es_res.search(
        fields=fields,
        term=term,
        filter=filter,
        sort=sort,
        aggregates=aggregates,
        page=page,
        page_size=page_size
    )
    results['sort'] = [
        {"value": "default", "label": "Relevance"},
        {"value": "experience_level", "label": "Experience Level"},
        {"value": "technology", "label": "Technology"},
    ]
    return results


def _search_aggr_study_resources(term, sort, filter, page, page_size):
    es_res = ElasticSearchInterface(['study_resources'])
    resources_fields = ['name^4', 'summary', 'category', 'technologies', 'tags']
    aggregates = {
        "price": {"terms": {"field": "price"}},
        "media": {"terms": {"field": "media"}},
        "experience_level": {"terms": {"field": "experience_level"}},
        "technologies": {"terms": {"field": "technologies.name"}},
        "tags": {"terms": {"field": "tags", "size": 20}},
        "category": {"terms": {"field": "category"}},
    }
    results = es_res.search(
        fields=resources_fields,
        term=term,
        filter=filter,
        sort=sort,
        aggregates=aggregates,
        page=page,
        page_size=page_size
    )
    results['sort'] = [
        {"value": "default", "label": "Relevance"},
        {"value": "rating", "label": "Rating"},
        {"value": "reviews_count", "label": "Reviews Count"},
        {"value": "publication_date", "label": "Published Date"},
        {"value": "created_at", "label": "Added Date"},
    ]
    return results


def _search_aggr_collections(term, sort, filter, page, page_size):
    es_res = ElasticSearchInterface(['collections'])
    collections_fields = ['name^4', 'description', 'technologies', 'tags']
    aggregates = {
        "technologies": {"terms": {"field": "technologies", "size": 20}},
        "tags": {"terms": {"field": "tags", "size": 20}},
    }
    filter.append({"term": {"is_public": True}})
    results = es_res.search(
        fields=collections_fields,
        term=term,
        filter=filter,
        sort=sort,
        aggregates=aggregates,
        page=page,
        page_size=page_size
    )
    results['sort'] = [
        {"value": "default", "label": "Relevance"},
        {"value": "thumbs_up", "label": "Votes"},
        {"value": "created_at", "label": "Added Date"},
    ]
    return results


def _search_aggr_technologies(term, sort, filter, page, page_size):
    es_res = ElasticSearchInterface(['technologies'])
    technologies_fields = ['name^4', 'description', 'ecosystem', 'tags']
    aggregates = {
        "license": {"terms": {"field": "license", "size": 10}},
        "ecosystem": {"terms": {"field": "ecosystem", "size": 20}},
        "category": {"terms": {"field": "category"}},
    }
    results = es_res.search(
        fields=technologies_fields,
        term=term,
        filter=filter,
        sort=sort,
        aggregates=aggregates,
        page=page,
        page_size=page_size
    )
    results['sort'] = [
        {"value": "default", "label": "Relevance"},
        {"value": "thumbs_up", "label": "Votes"},
        {"value": "created_at", "label": "Added Date"},
    ]
    return results


def _search_study_resources(term, filter, page, page_size):
    es_res = ElasticSearchInterface(['study_resources'])
    resources_fields = ['name^4', 'summary', 'category', 'technologies', 'tags']
    rating_sort = [{"rating": {"order": "desc", "missing": "_last", "unmapped_type": "long"}},
                   {"reviews": {"order": "desc", "missing": "_last", "unmapped_type": "long"}}]
    results = es_res.search(
        fields=resources_fields,
        term=term,
        filter=filter,
        # sort=rating_sort,
        aggregates={},
        page=page,
        page_size=page_size
    )
    return results


def _search_collections(term, filter, page, page_size):
    es_res = ElasticSearchInterface(['collections'])
    collections_fields = ['name^4', 'description', 'technologies', 'tags']
    filter.append({"term": {"is_public": True}})
    votes_sort = [{"thumbs_up": {"order": "desc", "missing": "_last", "unmapped_type": "long"}}, ]
    results = es_res.search(
        fields=collections_fields,
        term=term,
        filter=filter,
        # sort=votes_sort,
        aggregates={},
        page=page,
        page_size=page_size
    )
    return results


def _search_technologies(term, filter, page, page_size):
    es_res = ElasticSearchInterface(['technologies'])
    technologies_fields = ['name^4', 'description', 'ecosystem', 'tags']
    votes_sort = [{"thumbs_up": {"order": "desc", "missing": "_last", "unmapped_type": "long"}}, ]
    results = es_res.search(
        fields=technologies_fields,
        term=term,
        filter=filter,
        # sort=votes_sort,
        aggregates={},
        page=page,
        page_size=page_size
    )
    return results


def extract_sorting(request) -> []:
    sort = request.GET.get('sort', '').split('-')
    if sort[0] == 'default':
        return {}
    if len(sort) == 0:
        return {}
    if len(sort) == 1:
        sort.append('desc')
    field, order = sort[0], sort[1] if sort[1] in ['asc', 'desc'] else 'desc'
    return {field: {"order": order, "missing": "_last", "unmapped_type": "long"}}


def extract_filters(request) -> []:
    # We cycle through each possible parameters
    # http://127.0.0.1:8000/search/api/study_resources?q=create&tech_v=python|gte:2.1&tech_v=laravel&category=dev%20ops&page=1&page_size=5
    filter = []
    for param in request.GET.keys():
        if param in ['category', 'price', 'media', 'experience_level']:
            filter.append({
                "term": {param: request.GET.get(param)}
            })
        elif param in ['tags', 'ecosystem', 'technologies']:
            for value in request.GET.getlist(param):
                filter.append({
                    "term": {param: value}
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
