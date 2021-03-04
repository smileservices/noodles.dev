from django.test import TestCase, override_settings
from users.fake import create_user_single
from tag.fake import create_tags
from technology.fake import create_technologies
from category.fake import create_categories
from study_resource.fake import new_study_resource

from time import sleep

from tag.models import Tag
from technology.models import Technology
from study_resource.models import Review
from elasticsearch import Elasticsearch
from core.elasticsearch.elasticsearch_interface import ElasticSearchInterface


def format_tech_to_elastic(tech):
    return {
        'name': tech.name,
        'version': tech.version,
        'url': tech.absolute_url,
    }


@override_settings(ELASTICSEARCH_PREFIX='noodles')
class ElasticSearchIntegration(TestCase):
    # IMPORTANT!!!
    # When running tests: Remove the @task() decorator from the in core.tasks.py file
    # Could not set up huey to use the test database. Must find a solution for that

    def setUp(self) -> None:
        self.es = Elasticsearch()
        self.es.indices.delete('noodles_study_resources', ignore=[400, 404])
        self.es.indices.delete('noodles_technologies', ignore=[400, 404])

        self.esi = ElasticSearchInterface(['study_resources'])
        self.est = ElasticSearchInterface(['technologies'])
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
        user_1 = create_user_single()
        resource_1 = new_study_resource(user_1)
        resource_1.save()
        user_2 = create_user_single()
        resource_2 = new_study_resource(user_2)
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
        sleep(2)  # elastic indexing requires some time
        latest = self.esi.latest()
        resource_1_es = self.esi.get_by_pk(resource_1.pk)
        self.assertEqual(latest['stats']['total'], 2)
        self.assertEqual(resource_1_es['items'][0]['technologies'],
                         [format_tech_to_elastic(t) for t in resource_1.get_technologies()])
        self.assertEqual(resource_1_es['items'][0]['tags'], [str(t) for t in resource_1.tags.all()])

        # when modifying a tech name this should trigger the resync
        modified_tech = self.techs[1]
        modified_tech.name = f'modified from {modified_tech.name}'
        modified_tech.save()
        sleep(2)  # elastic indexing requires some time
        resource_1_es = self.esi.get_by_pk(resource_1.pk)
        resource_2_es = self.esi.get_by_pk(resource_2.pk)
        self.assertEqual(modified_tech.name, resource_1_es['items'][0]['technologies'][1]['name'])
        self.assertEqual(modified_tech.name, resource_2_es['items'][0]['technologies'][1]['name'])

    def test_votes_syncing(self):
        tech = self.techs[1]
        user = create_user_single()
        tech.vote_up(user)
        sleep(3)
        elastic_record = self.est.get_by_pk(tech.pk)
        self.assertEqual(elastic_record['items'][0]['thumbs_up'], 1)
        tech.cancel_vote(user)
        sleep(3)
        elastic_record = self.est.get_by_pk(tech.pk)
        self.assertEqual(elastic_record['items'][0]['thumbs_up'], 0)

    def test_reviews_syncing(self):
        user = create_user_single()
        resource = new_study_resource(user)
        review = Review(
            study_resource=resource,
            rating=4,
            author=user,
            text='some review text'
        )
        review.save()
        sleep(3)
        latest = self.esi.latest()
        self.assertEqual(latest['items'][0]['reviews_count'], 1)
        self.assertEqual(latest['items'][0]['rating'], 4)
