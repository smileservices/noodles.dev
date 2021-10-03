from huey.contrib.djhuey import task, periodic_task
from huey import crontab
from .elasticsearch.elasticsearch_interface import save_to_elastic, delete_from_elastic
from .elasticsearch.elasticsearch_interface import ElasticSearchInterface
import logging
from django.core.management import call_command
from history.models import ResourceHistoryModel
import json


def set_to_sync(syncable_instance):
    mapping = syncable_instance.get_elastic_mapping()
    index, data = syncable_instance.get_elastic_data()
    save_to_elastic(index, mapping, data)


def sync_technologies_to_elastic():
    from technology.models import Technology
    logger = logging.getLogger('huey')
    for technology_instance in Technology.objects.all():
        mapping = technology_instance.get_elastic_mapping()
        index, data = technology_instance.get_elastic_data()
        save_to_elastic(index, mapping, data)
    logger.info(f'synced {Technology.objects.count()} technologies - ok')


def sync_tutorials_to_elastic():
    from study_resource.models import StudyResource
    logger = logging.getLogger('huey')
    for study_resource in StudyResource.objects.all():
        mapping = study_resource.get_elastic_mapping()
        index, data = study_resource.get_elastic_data()
        save_to_elastic(index, mapping, data)
    logger.info(f'synced {StudyResource.objects.count()} study resources - ok')


def sync_collections_to_elastic():
    from study_collection.models import Collection
    logger = logging.getLogger('huey')
    for collection in Collection.objects.all():
        mapping = collection.get_elastic_mapping()
        index, data = collection.get_elastic_data()
        save_to_elastic(index, mapping, data)
    logger.info(f'synced {Collection.objects.count()} collections - ok')


def sync_categories_to_elastic():
    from category.models import Category
    logger = logging.getLogger('huey')
    for category in Category.objects.all():
        mapping = category.get_elastic_mapping()
        index, data = category.get_elastic_data()
        save_to_elastic(index, mapping, data)
    logger.info(f'synced {Category.objects.count()} categories - ok')


def sync_category_concepts_to_elastic():
    from concepts.models import CategoryConcept
    logger = logging.getLogger('huey')
    for concept in CategoryConcept.objects.all():
        mapping = concept.get_elastic_mapping()
        index, data = concept.get_elastic_data()
        save_to_elastic(index, mapping, data)
    logger.info(f'synced {CategoryConcept.objects.count()} category concepts - ok')


def sync_technology_concepts_to_elastic():
    from concepts.models import TechnologyConcept
    logger = logging.getLogger('huey')
    for concept in TechnologyConcept.objects.all():
        mapping = concept.get_elastic_mapping()
        index, data = concept.get_elastic_data()
        save_to_elastic(index, mapping, data)
    logger.info(f'synced {TechnologyConcept.objects.count()} technology concepts - ok')


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


# @periodic_task(crontab(hour='6'))
def task_sync_all_to_elastic():
    logger = logging.getLogger('huey')
    logger.info('syncing all resources to elasticsearch')
    ElasticSearchInterface.clean()
    logger.info('clean all elasticsearch indices - ok')
    sync_technologies_to_elastic()
    sync_tutorials_to_elastic()
    sync_collections_to_elastic()
    sync_categories_to_elastic()
    sync_category_concepts_to_elastic()
    sync_technology_concepts_to_elastic()


@periodic_task(crontab(minute='*/1'))
def send_queued_email():
    call_command('send_mail')


@periodic_task(crontab(minute='*/5'))
def retry_send_email():
    call_command('retry_deferred')


# @periodic_task(crontab(day='*/7'))
# def clean_email_logs():
# i don't know how to send the `purge_mail_log 7 -r=all`
#     call_command('purge_mail_log', 7, r='all')


def sync_to_elastic(sender, **kwargs):
    mapping = sender.get_elastic_mapping()
    index, data = kwargs.get('instance').get_elastic_data()
    task_sync_data(index, mapping, data)


def sync_delete_to_elastic(sender, **kwargs):
    instance = kwargs.get('instance')
    task_delete_record(instance.elastic_index, instance.pk)


def sync_technology_resources_to_elastic(sender, **kwargs):
    # this runs when a m2m field like category, tag or technology changes its name
    update_fields = kwargs['update_fields']
    if update_fields and 'name' in update_fields:
        instance = kwargs.get('instance')
        task_sync_technologies_related(instance.pk, sender)


@periodic_task(crontab(hour='*/1'))
def clean_db():
    # clean tags
    from tag.models import Tag
    Tag.objects.filter(
        resources=None,
        collections=None,
        tags_StudyResource=None # study resource tags
    ).delete()

# todo 2 tasks - one for update directly, another through publishing edits
# tasks should take serialized data and compare; for different values, make the diff

@task()
def add_history_record_update(model, pk, changes_text, author_id, operation_source, operation_type, edit_reason='', edit_published_by_id=None):
    # use python diff_match_patch library
    # cycle through each field and compute changes
    instance = model.objects.get(pk=pk)
    instance.history.create(
        changes=changes_text,
        author_id=author_id,
        edit_published_by_id=edit_published_by_id,
        edit_reason=edit_reason,
        operation_source=operation_source,
        operation_type=operation_type,
    )
