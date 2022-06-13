import logging
import json
from . import events
from users.models import CustomUser
from history.models import ResourceHistoryModel
from allauth.account.signals import user_logged_in, user_signed_up, user_logged_out
from django.core.mail import mail_admins

activity_logger = logging.getLogger('activity')


def failsafe_log_decorator(func):
    # just run the function under a try/catch because we don't want to halt the app
    # if there is something wrong with the activity logging. maybe a field changed
    def decorated_func(*args, **kwargs):
        try:
            func(*args, **kwargs)
        except Exception as e:
            # if it fails, log error log.
            try:
                error_msg = {'event': 'LOGGER', 'message': str(e)}
                activity_logger.error(json.dumps(error_msg))
            except Exception as e:
                # if that fails too, send email to admin
                mail_admins(
                    subject=f'Error Writing To ActivityLog',
                    message=f'ERROR: \n'
                            f'{str(e)}\n\n'
                )

    return decorated_func


def serialize_for_further_import(instance):
    # returns module and model name so it can be used in the further
    return {
        'model_str': f'{instance.__class__.__module__}.{instance.__class__._meta.object_name}',
        'pk': instance.pk
    }


@failsafe_log_decorator
def error(msg):
    activity_logger.error(msg)


@failsafe_log_decorator
def log_activity(obj):
    msg_dict = {
        'display': obj
    }
    activity_logger.info(json.dumps(msg_dict))


@failsafe_log_decorator
def log_resource_op(instance, request, OP):
    msg_dict = {
        'display': {
            'event_author': request.user.username,
            'event': f'{events.RESOURCE}-{OP}',
            'resource_url': instance.absolute_url,
            'name': instance.name,
        },
        'process': {
            'event': f'{events.RESOURCE}-{OP}',
            'instance': serialize_for_further_import(instance),
            'event_author': request.user.pk
        }
    }
    activity_logger.info(json.dumps(msg_dict))


@failsafe_log_decorator
def log_study_resource_create(create_response, request):
    msg_dict = {
        'display': {
            'event_author': request.user.username,
            'event': f'{events.RESOURCE}-{events.OP_CREATE}',
            'resource_url': create_response.data['absolute_url'],
            'name': create_response.data['name'],
        },
        'process': {
            'event': f'{events.RESOURCE}-{events.OP_CREATE}',
            'instance': {'model_str': 'study_resource.models.StudyResource', 'pk': create_response.data['pk']},
            'event_author': request.user.pk
        }
    }
    activity_logger.info(json.dumps(msg_dict))


@failsafe_log_decorator
def log_resource_edit_suggestion_created(instance, request):
    msg_dict = {
        'display': {
            'event_author': request.user.username,
            'event': f'{events.EDIT_SUGGESTION}-{events.OP_CREATE}',
            'resource_url': instance.absolute_url,
            'name': instance.name,
            'edit_suggestion_reason': request.data['edit_suggestion_reason']
        },
        'process': {
            'event': f'{events.EDIT_SUGGESTION}-{events.OP_CREATE}',
            'instance': serialize_for_further_import(instance),
            'event_author': request.user.pk
        }
    }
    activity_logger.info(json.dumps(msg_dict))


@failsafe_log_decorator
def log_resource_edit_suggestion_operation(instance, operation, request):
    msg_dict = {
        'display': {
            'event_author': request.user.username,
            'event': f'{events.EDIT_SUGGESTION}-{operation}',
            'resource_url': instance.edit_suggestion_parent.absolute_url,
            'name': instance.name,
        },
        'process': {
            'event': f'{events.EDIT_SUGGESTION}-{operation}',
            'instance': serialize_for_further_import(instance.edit_suggestion_parent),
            'event_author': request.user.pk
        }
    }
    activity_logger.info(json.dumps(msg_dict))


@failsafe_log_decorator
def log_resource_add_error(message, resource_url, event_type):
    msg_dict = {
        'display': {
            'event': events.ERROR,
            'event_type': event_type,
            'url': resource_url,
            'message': message,
        }
    }
    activity_logger.error(json.dumps(msg_dict))


@failsafe_log_decorator
def log_resource_error(message, request, event_type):
    msg_dict = {
        'display': {
            'event_author': request.user.username,
            'event': events.ERROR,
            'event_type': event_type,
            'url': request.META["PATH_INFO"],
            'message': message,
        }
    }
    activity_logger.error(json.dumps(msg_dict))


@failsafe_log_decorator
def log_review(review, operation):
    instance = review.study_resource
    msg_dict = {
        'display': {
            'event_author': review.author.username,
            'event': f'{events.REVIEW}-{operation}',
            'resource_url': instance.absolute_url,
            'name': instance.name,
            'rating': review.rating,
        },
        'process': {
            'event': f'{events.REVIEW}-{operation}',
            'instance': serialize_for_further_import(review),
            'event_author': review.author.username,
        }
    }
    activity_logger.info(json.dumps(msg_dict))


@failsafe_log_decorator
def log_vote(instance, vote, user, error=''):
    msg_dict = {
        'display': {
            'event_author': user.username,
            'event': events.VOTE + f' {events.ERROR}' if error else '',
            'vote': vote,
            'resource_url': instance.absolute_url,
            'name': instance.name,
        },
        'process': {
            'event': events.VOTE,
            'instance': serialize_for_further_import(instance),
            'event_author': user.pk
        }
    }
    activity_logger.info(json.dumps(msg_dict))


@failsafe_log_decorator
def log_history_record(instance, author_id, edit_published_by_id, operation_type, operation_source, edit_reason):
    author = CustomUser.objects.get(pk=author_id)
    published_by = CustomUser.objects.get(pk=author_id) if edit_published_by_id else None
    operation_source_label = ResourceHistoryModel.OperationSource(operation_source).label
    operation_type_label = ResourceHistoryModel.OperationType(operation_type).label
    msg_dict = {
        'display': {
            'event_author': published_by.username if published_by else author.username,
            'event': f'{events.HISTORY}-{operation_type_label}',
            'event_source': operation_source_label,
            'resource_url': instance.absolute_url,
            'name': instance.name,
            'edit_reason': edit_reason,
        },
        'process': {
            'event': f'{events.HISTORY}-{operation_type_label}',
            'event_source': operation_source_label,
            'instance': serialize_for_further_import(instance),
            'event_author': published_by.pk if published_by else author.pk
        }
    }
    activity_logger.info(json.dumps(msg_dict))


def get_log_user_handler(op):
    @failsafe_log_decorator
    def log_user(request, user, **kwargs):
        msg_dict = {
            'display': {
                'event': f'{events.USER}-{op}',
                'username': user.username,
            }
        }
        activity_logger.info(json.dumps(msg_dict))

    return log_user


user_logged_in.connect(receiver=get_log_user_handler(events.USER_LOGIN), weak=False)
user_logged_out.connect(receiver=get_log_user_handler(events.USER_LOGOUT), weak=False)
user_signed_up.connect(receiver=get_log_user_handler(events.USER_REGISTER), weak=False)
