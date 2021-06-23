"""Clear the database preserving shop's configuration.

This command clears the database from data such as orders, products or customer
accounts. It doesn't remove shop's configuration, such as: staff accounts, service
accounts, plugin configurations, site settings or navigation menus.
"""
from django.core.management.base import BaseCommand
from core import tasks
from core.elasticsearch.elasticsearch_interface import ElasticSearchInterface
import logging


class Command(BaseCommand):
    help = "Resync data to elasticsearch"

    def add_arguments(self, parser):
        parser.add_argument(
            "--all",
            action="store_true",
            help="Sync all technologies, tutorials, collections, categories, concepts",
        )
        parser.add_argument(
            "--resource",
            type=str,
            help="What kind of resource: technologies/tutorials/collections/categories/category_concepts/technology_concepts",
        )

    def handle(self, **options):
        logger = logging.getLogger('django')
        if options['all']:
            logger.info('syncing all to elasticsearch')
            ElasticSearchInterface.clean()
            logger.info('clean all elasticsearch indices - ok')
            tasks.sync_technologies_to_elastic()
            logger.info('sync technologies - ok')
            tasks.sync_tutorials_to_elastic()
            logger.info('sync tutorials - ok')
            tasks.sync_collections_to_elastic()
            logger.info('sync collections - ok')
            tasks.sync_categories_to_elastic()
            logger.info('sync categories - ok')
            tasks.sync_category_concepts_to_elastic()
            logger.info('sync category concepts - ok')
            tasks.sync_technology_concepts_to_elastic()
            logger.info('sync technology concepts - ok')
        else:
            index = options['resource']
            if index not in ['technologies', 'tutorials', 'collections']:
                raise ValueError('index must be one of this: technologies/tutorials/collections')
            logger.info(f'syncing {index} to elasticsearch')
            ElasticSearchInterface.clean(index)
            logger.info(f'clean elasticsearch {index} - ok')
            if index == 'technologies':
                tasks.sync_technologies_to_elastic()
            elif index == 'tutorials':
                tasks.sync_tutorials_to_elastic()
            elif index == 'collections':
                tasks.sync_collections_to_elastic()
            elif index == 'categories':
                tasks.sync_categories_to_elastic()
            elif index == 'category_concepts':
                tasks.sync_category_concepts_to_elastic()
            elif index == 'technology_concepts':
                tasks.sync_technology_concepts_to_elastic()
            logger.info(f'sync {index} - ok')
        logger.info('sync command finished')
