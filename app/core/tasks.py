from huey.contrib.djhuey import task, periodic_task
from huey import crontab
from .elasticsearch.elasticsearch_interface import save_to_elastic, delete_from_elastic
from .elasticsearch.elasticsearch_interface import ElasticSearchInterface
import logging


def set_to_sync(syncable_instance):
    mapping = syncable_instance.get_elastic_mapping()
    index, data = syncable_instance.get_elastic_data()
    save_to_elastic(index, mapping, data)


@task()
def task_sync_data(index, mapping, data):
    save_to_elastic(index, mapping, data)


@task()
def task_delete_record(index, id):
    delete_from_elastic(index, id)


@task()
def task_sync_technologies_related(pk, TechnologyModel):
    # 1st - update the resource technology pivot name
    # 2nd - resync items to elasticindex

    # TechnologyModel = import_module()
    technology = TechnologyModel.objects.get(pk=pk)

    # updated pivot name for resources techs
    StudyResourceTechnologyModel = technology.resources.model.technologies.through
    for entry in StudyResourceTechnologyModel.objects.filter(technology=technology):
        entry.name = technology.name
        entry.save()

    # go through collections, study syncable_instances and other technologies and resync them
    related_resources = technology.resources.all()
    related_collections = technology.collections.all()
    related_technologies = technology.related_technologies.all()
    for resource in related_resources:
        set_to_sync(resource)
    for resource in related_collections:
        set_to_sync(resource)
    for resource in related_technologies:
        set_to_sync(resource)


@periodic_task(crontab(hour='6'))
def sync_all_to_elastic():
    from technology.models import Technology
    from study_resource.models import StudyResource
    from study_collection.models import Collection
    # task to resync all resources to elasticsearch
    logger = logging.getLogger('huey')
    logger.info('syncing all resources to elasticsearch')
    ElasticSearchInterface.clean()
    logger.info('clean all elasticsearch indices - ok')
    for technology_instance in Technology.objects.all():
        mapping = technology_instance.get_elastic_mapping()
        index, data = technology_instance.get_elastic_data()
        save_to_elastic(index, mapping, data)
    logger.info(f'synced {Technology.objects.count()} technologies - ok')
    for study_resource in StudyResource.objects.all():
        mapping = study_resource.get_elastic_mapping()
        index, data = study_resource.get_elastic_data()
        save_to_elastic(index, mapping, data)
    logger.info(f'synced {StudyResource.objects.count()} study resources - ok')
    for collection in Collection.objects.all():
        mapping = collection.get_elastic_mapping()
        index, data = collection.get_elastic_data()
        save_to_elastic(index, mapping, data)
    logger.info(f'synced {Collection.objects.count()} collections - ok')


def sync_to_elastic(sender, **kwargs):
    mapping = sender.get_elastic_mapping()
    index, data = kwargs.get('instance').get_elastic_data()
    task_sync_data(index, mapping, data)


def sync_delete_to_elastic(sender, **kwargs):
    index, data = kwargs.get('instance').get_elastic_data()
    task_delete_record(index, data['pk'])


def sync_technology_resources_to_elastic(sender, **kwargs):
    # this runs when a m2m field like category, tag or technology changes its name
    update_fields = kwargs['update_fields']
    if update_fields and 'name' in update_fields:
        instance = kwargs.get('instance')
        task_sync_technologies_related(instance.pk, sender)
