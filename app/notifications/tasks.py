from huey.contrib.djhuey import task
from .models import Notifications
from django.db.models import ObjectDoesNotExist
from . import events
from users.models import CustomUser


@task()
def subscribe(instance, user):
    instance_subs, created = instance.subscribers.get_or_create()
    instance_subs.users.append(user.pk)
    instance_subs.save()


@task()
def unsubscribe(instance, user):
    try:
        instance_subs, created = instance.subscribers.get_or_create()
        if created:
            instance_subs.users.append(instance.author.pk)
            instance_subs.save()
            return None
        instance_subs.users.remove(user.pk)
        instance_subs.save()
    except ValueError as e:
        pass


def upstream_subscriptions(instance, actor):
    # returns a list of users from connected resources to notify
    # study-resource create/update/review - notify technology, tech concept, categ concept, category
    # technology create/update - notify category
    # concept create - notify category, parent/children
    model_name = instance.__class__._meta.model_name

    def subscribe_and_get_users(obj):
        subscribers = getattr(obj, 'subscribers')
        sub, created = subscribers.get_or_create()
        if actor not in sub.users:
            sub.users.append(actor)
            sub.save()
        return sub.users

    users_list = subscribe_and_get_users(instance)

    if model_name == 'studyresource':
        users_list += subscribe_and_get_users(instance.category)
        for tech in instance.technologies.all():
            users_list += subscribe_and_get_users(tech)
        for concept in instance.category_concepts.all():
            users_list += subscribe_and_get_users(concept)
        for concept in instance.technology_concepts.all():
            users_list += subscribe_and_get_users(concept)
    elif model_name == 'technology':
        for category in instance.category.all():
            users_list += subscribe_and_get_users(category)
    elif model_name == 'category':
        if instance.parent:
            users_list += subscribe_and_get_users(instance.parent)
    elif model_name == 'categoryconcept':
        users_list += subscribe_and_get_users(instance.category)
        if instance.parent:
            users_list += subscribe_and_get_users(instance.parent)
    elif model_name == 'technologyconcept':
        users_list += subscribe_and_get_users(instance.technology)
        if instance.parent:
            users_list += subscribe_and_get_users(instance.parent)

    return users_list


@task()
def create_notification(model, pk: int, actor: int, verb: str):
    '''
        model, pk   -- to dynamically instantiate the object
        code        -- pass into the object .process_notification(code) to get message, notifiable entities list
        actor       -- user pk
    '''
    instance = model.objects.get(pk=pk)
    actor_user = CustomUser.objects.get(pk=actor)
    message = events.MESSAGE_ACTOR.format(actor=actor_user.username, verb=verb, url=instance.absolute_url,
                                          name=instance.name)
    # create notifications
    notifications = []
    subscribers, created = instance.subscribers.get_or_create()
    users_to_notify = subscribers.users + upstream_subscriptions(instance, actor)
    users_to_notify.users.remove(actor)
    for user_id in users_to_notify:
        notifications.append(Notifications(user_id=user_id, message=message))
    if len(notifications):
        Notifications.objects.bulk_create(notifications, 1000)
    # add to subscribers
    if actor not in subscribers.users:
        subscribers.users.append(actor)
        subscribers.save()
