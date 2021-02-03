from django.test import TestCase, override_settings
from users.fake import create_user_single
from tag.fake import create_tags
from technology.fake import create_technologies
from category.fake import create_categories
from study_resource.fake import new_study_resource

from time import sleep

from tag.models import Tag
from technology.models import Technology
from elasticsearch import Elasticsearch
from core.elasticsearch.elasticsearch_interface import ElasticSearchInterface


@override_settings(ELASTICSEARCH_PREFIX='noodles')
class ElasticSearchIntegration(TestCase):

    def setUp(self) -> None:
        self.es = Elasticsearch()
        self.esi = ElasticSearchInterface(['study_resources'])
        create_categories()
        create_tags()
        create_technologies()
        self.tags = Tag.objects.all()
        self.techs = Technology.objects.all()

    def tearDown(self) -> None:
        self.es.indices.delete('noodles_study_resources', ignore=[400, 404])
        self.es.indices.delete('noodles_technologies', ignore=[400, 404])

    def test_create_study_resource(self):
        # tests creating a study resource signals
        # adds job in Redis
        # running the job creates index and adds it to the eleasticsearch
        user = create_user_single()
        resource_1 = new_study_resource(user)
        resource_1.save()
        user = create_user_single()
        resource_2 = new_study_resource(user)
        resource_1.save()
        resource_2.save()

        # add tags
        resource_1.tags.add(self.tags[0], self.tags[1])
        resource_2.tags.add(self.tags[1], self.tags[2])

        # add techs
        for tech in [self.techs[0], self.techs[1]]:
            resource_1.technologies.through.objects.create(
                technology=tech,
                study_resource=resource_1,
                version='1.0'
            )
        for tech in [self.techs[0], self.techs[1]]:
            resource_2.technologies.through.objects.create(
                technology=tech,
                study_resource=resource_2,
                version='1.0'
            )
        resource_1.save()
        resource_2.save()
        sleep(1) # elastic indexing requires some time
        latest = self.esi.latest()
        self.assertEqual(latest['stats']['total'], 2)
        self.assertEqual(latest['items'][0]['technologies'], [str(t) for t in resource_1.get_technologies()])
        self.assertEqual(latest['items'][0]['tags'], [str(t) for t in resource_1.tags.all()])

        # when modifying a tech name this should trigger the resync
        modified_tech = self.techs[1]
        modified_tech.name = 'modified'
        modified_tech.save()
        sleep(1) # elastic indexing requires some time
        latest = self.esi.latest()
        self.assertIn('modified 1.0', latest['items'][0]['technologies'])
        self.assertIn('modified 1.0', latest['items'][1]['technologies'])
