import logging
from elasticsearch import Elasticsearch
from django.conf import settings


def get_index_name(index):
    return '{}_{}'.format(settings.ELASTICSEARCH_PREFIX, index)


def save_to_elastic(index, mapping, data):
    esi = ElasticSearchIndexInterface(mapping=mapping, index=index)
    if esi.exists():
        esi.save(data, data['pk'])
    else:
        esi.create_index()
        esi.save(data, data['pk'])


def delete_from_elastic(index, id):
    esi = ElasticSearchIndexInterface(mapping=False, index=index)
    esi.delete(id)


class ElasticSearchInterface:

    def __init__(self, indexes):
        '''
        :param mapping: [] config for mapping
        :param idx_prefix: index name
        :param settings: settings for building the index (mapping, analyze)
        '''
        self.connection = Elasticsearch(
            settings.ELASTICSEARCH_HOST,
            http_auth=settings.ELASTICSEARCH_AUTH,
            schema=settings.ELASTICSEARCH_AUTH,
            port=settings.ELASTICSEARCH_PORT,
            timeout=30, max_retries=10, retry_on_timeout=True
        )
        self.indexes = [get_index_name(i) for i in indexes]

    @staticmethod
    def clean(index=False):
        connection = Elasticsearch(
            settings.ELASTICSEARCH_HOST,
            http_auth=settings.ELASTICSEARCH_AUTH,
            schema=settings.ELASTICSEARCH_AUTH,
            port=settings.ELASTICSEARCH_PORT,
            timeout=30, max_retries=10, retry_on_timeout=True
        )
        if index:
            connection.indices.delete([get_index_name(index), ], ignore_unavailable=True)
        else:
            connection.indices.delete([get_index_name(i) for i in ('study_resources', 'collections', 'technologies')],
                                      ignore_unavailable=True)

    def search(self, fields, term, filter, sort={}, aggregates=None, page=0, page_size=10):
        page_offset = page * page_size
        q = {
            "from": page_offset,
            "size": page_size,
            "sort": sort,
            "query": {
                "bool": {
                    "filter": filter
                }
            }
        }
        if term:
            q["query"]["bool"]["must"] = [{
                "multi_match": {
                    "query": term,
                    "fields": fields,
                    "fuzziness": 1
                }
            }]
        if aggregates:
            q["aggs"] = aggregates
        res = self.connection.search(self.indexes, body=q)
        extracted_response = self._extract_results(res, 'search')
        extracted_response['stats']['page_size'] = page_size
        return extracted_response

    def aggregates(self, aggregates):
        q = {"aggs": aggregates, "size": 0}
        res = self.connection.search(self.indexes, body=q)
        extracted_response = self._extract_results(res, 'aggregation')
        return extracted_response

    def suggest(self, prefix):
        q = {
            "suggest": {
                "text": prefix,
                "search-suggest": {
                    "completion": {
                        "field": "suggest",
                        "size": 5,
                    }
                }
            }
        }
        res = self.connection.search(self.indexes, body=q)
        return self._extract_results(res, 'suggest')

    def sort_by(self, sort, page=0, page_size=10):
        page_offset = page * page_size
        q = {
            "from": page_offset,
            "size": page_size,
            "sort": sort
        }
        res = self.connection.search(self.indexes, body=q)
        extracted_response = self._extract_results(res, 'search')
        extracted_response['stats']['page_size'] = page_size
        return extracted_response

    def get_by_pk(self, pk):
        q = {
            "from": 0,
            "size": 1,
            "query": {
                "bool": {
                    "filter": {"term": {"pk": pk}}
                }
            }
        }
        res = self.connection.search(self.indexes, body=q)
        extracted_response = self._extract_results(res, 'search')
        return extracted_response

    def latest(self, page=0, page_size=10):
        return self.sort_by(
            [{"created_at": {"order": "desc", "missing": "_last", "unmapped_type": "long"}}, ],
            page,
            page_size
        )

    def _extract_results(self, res, type):
        extracted = {}
        if type == 'search':
            results = [r['_source'] for r in res['hits']['hits']]
            filters = {}
            if 'aggregations' in res:
                for name, v in res['aggregations'].items():
                    if 'doc_count' in v and v['doc_count'] == 0:
                        continue
                    filters[name] = {}
                    for item in v['buckets']:
                        filters[name][item['key']] = item['doc_count']
            extracted = {
                'items': results,
                'filters': filters,
                'stats': {
                    'total': res['hits']['total']['value'],
                    'count': len(results)
                }
            }
        elif type == 'suggest':
            extracted = [r['text'] for r in res['suggest']['search-suggest'][0]['options']]
        elif type == 'aggregation':
            for name, v in res['aggregations'].items():
                if 'doc_count' in v and v['doc_count'] == 0:
                    continue
                extracted[name] = {}
                for item in v['buckets']:
                    extracted[name][item['key']] = item['doc_count']
        return extracted


class ElasticSearchIndexInterface(ElasticSearchInterface):
    index_settings = {
        "number_of_shards": 1,
        "analysis": {
            "analyzer": {
                "ngram": {
                    "type": "custom",
                    "char_filter": ["html_strip"],
                    "filter": ["lowercase", "asciifolding"],
                    "tokenizer": "ngram"
                }
            },
            "tokenizer": {
                "ngram": {
                    "token_chars": ["letter", "digit"],
                    "min_gram": "2",
                    "type": "edge_ngram",
                    "max_gram": "10"
                }
            }
        }
    }

    def __init__(self, mapping, index):
        '''
        :param mapping: [] config for mapping
        :param index: index name
        '''
        super().__init__(indexes=[index, ])
        self.mapping = mapping

    @property
    def index_name(self):
        return self.indexes[0]

    def create_index(self):
        body = {
            'settings': self.index_settings,
            'mappings': self.mapping
        }
        self.connection.indices.create(index=self.index_name, body=body)

    def save(self, obj, id):
        self.connection.index(index=self.index_name, doc_type='_doc', id=id, body=obj)

    def delete(self, id):
        self.connection.delete(index=self.index_name, id=id)

    def exists(self):
        return self.connection.indices.exists(index=self.index_name)

    def record_exists(self, id):
        q = {
            'size': 0,
            'query': {
                'bool': {
                    'filter': {
                        'term': {"id": id}
                    }
                }
            }
        }
        res = self.connection.search(self.index_name, q)
        return res['hits']['total']['value'] != 0
