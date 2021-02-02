from huey.contrib.djhuey import task
from .elasticsearch.elasticsearch_interface import ElasticSearchIndexInterface, save_to_elastic
from importlib import import_module

technology_model_class_module = 'technology.models.Technology'


def set_to_sync(syncable_instance):
    mapping = syncable_instance.get_elastic_mapping()
    index, data = syncable_instance.get_elastic_data()
    save_to_elastic(index, mapping, data)


@task()
def task_sync_data(index, mapping, data):
    save_to_elastic(index, mapping, data)


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
    # for resource in related_collections:
    #     set_to_sync(resource)
    for resource in related_technologies:
        set_to_sync(resource)


def sync_to_elastic(sender, **kwargs):
    mapping = sender.get_elastic_mapping()
    index, data = kwargs.get('instance').get_elastic_data()
    task_sync_data(index, mapping, data)


def sync_technology_resources_to_elastic(sender, **kwargs):
    # this runs when a m2m field like category, tag or technology changes its name
    update_fields = kwargs['update_fields']
    if update_fields and 'name' in update_fields:
        instance = kwargs.get('instance')
        task_sync_technologies_related(instance.pk, sender)
