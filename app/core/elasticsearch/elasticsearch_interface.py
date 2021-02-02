import logging
from elasticsearch import Elasticsearch
from django.conf import settings


def get_index_name(index):
    return '{}_{}'.format(settings.ELASTICSEARCH_PREFIX, index)


def save_to_elastic(index, mapping, data):
    connection = Elasticsearch()
    index_name = get_index_name(index)
    if connection.indices.exists(index=index_name):
        connection.index(index=index_name, doc_type='_doc', id=data['pk'], body=data)
    else:
        body = {
            'settings': {
                'number_of_shards': 1
            },
            'mappings': mapping
        }
        connection.indices.create(index_name, body=body)
        connection.index(index=index_name, doc_type='_doc', id=data['pk'], body=data)


class ElasticSearchInterface:

    def __init__(self, indexes):
        '''
        :param mapping: [] config for mapping
        :param idx_prefix: index name
        :param settings: settings for building the index (mapping, analyze)
        '''
        self.connection = Elasticsearch()
        self.indexes = [get_index_name(i) for i in indexes]

    @staticmethod
    def clean():
        connection = Elasticsearch()
        connection.indices.delete('_all')

    def search(self, fields, term, page=0, page_size=10):
        page_offset = page * page_size
        q = {
            "from": page_offset,
            "size": page_size,
            "query": {
                "multi_match": {
                    "query": term,
                    "fields": fields,
                    "fuzziness": 1
                }
            }
        }
        res = self.connection.search(self.indexes, body=q)
        extracted_response = self._extract_results(res, 'search')
        extracted_response['stats']['page_size'] = page_size
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

    def latest(self, page=0, page_size=10):
        page_offset = page * page_size
        q = {
            "from": page_offset,
            "size": page_size,
            "sort": [
                {"date": {"order": "desc", "missing": "_last", "unmapped_type": "long"}},
            ]
        }
        res = self.connection.search(self.indexes, body=q)
        extracted_response = self._extract_results(res, 'search')
        extracted_response['stats']['page_size'] = page_size
        return extracted_response

    def _extract_results(self, res, type):
        extracted = False
        if type == 'search':
            results = [r['_source'] for r in res['hits']['hits']]
            extracted = {
                'items': results,
                'stats': {
                    'total': res['hits']['total']['value'],
                    'count': len(results)
                }
            }
        elif type == 'suggest':
            extracted = [r['text'] for r in res['suggest']['search-suggest'][0]['options']]
        return extracted


class ElasticSearchIndexInterface(ElasticSearchInterface):
    index_settings = {
        'number_of_shards': 1
    }

    def __init__(self, mapping, index):
        '''
        :param mapping: [] config for mapping
        :param index: index name
        '''
        super().__init__(indexes=[get_index_name(index), ])
        self.mapping = mapping

    @property
    def index_name(self):
        return self.indexes[0]

    def create_index(self):
        body = {
            'settings': self.index_settings,
            'mappings': self.mapping
        }
        if 'analyzer' in self.index_settings:
            body['settings']['analyzer'] = self.index_settings['analyzer']
        self.connection.indices.create(self.index_name, body=body)

    def save(self, obj, id):
        self.connection.index(index=self.index_name, doc_type='_doc', id=id, body=obj)

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
