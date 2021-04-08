"""Clear the database preserving shop's configuration.

This command clears the database from data such as orders, products or customer
accounts. It doesn't remove shop's configuration, such as: staff accounts, service
accounts, plugin configurations, site settings or navigation menus.
"""
from django.core.management.base import BaseCommand
from core.tasks import sync_technologies_to_elastic, sync_tutorials_to_elastic, sync_collections_to_elastic
from core.elasticsearch.elasticsearch_interface import ElasticSearchInterface
import logging


class Command(BaseCommand):
    help = "Resync data to elasticsearch"

    def add_arguments(self, parser):
        parser.add_argument(
            "--all",
            action="store_true",
            help="Sync all technologies, tutorials, collections",
        )
        parser.add_argument(
            "--resource",
            type=str,
            help="What kind of resource: technologies/tutorials/collections",
        )

    def handle(self, **options):
        logger = logging.getLogger('django')
        if options['all']:
            logger.info('syncing all to elasticsearch')
            ElasticSearchInterface.clean()
            logger.info('clean all elasticsearch indices - ok')
            sync_technologies_to_elastic()
            logger.info('sync technologies - ok')
            sync_tutorials_to_elastic()
            logger.info('sync tutorials - ok')
            sync_collections_to_elastic()
            logger.info('sync collections - ok')
        else:
            index = options['resource']
            if index not in ['technologies', 'tutorials', 'collections']:
                raise ValueError('index must be one of this: technologies/tutorials/collections')
            logger.info(f'syncing {index} to elasticsearch')
            ElasticSearchInterface.clean(index)
            logger.info(f'clean elasticsearch {index} - ok')
            if index == 'technologies':
                sync_technologies_to_elastic()
            elif index == 'tutorials':
                sync_tutorials_to_elastic()
            elif index == 'collections':
                sync_collections_to_elastic()
            logger.info(f'sync {index} - ok')
        logger.info('sync command finished')
