from votable.viewsets import VotableVieset
from django_edit_suggestion.rest_views import ModelViewsetWithEditSuggestion
from app.settings import rewards
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.decorators import action
from django.core.paginator import Paginator
from core.status import HTTP_209_EDIT_SUGGESTION_CREATED
from django.core.mail import mail_admins
from core.serializers import serializeValidationError
from core.tasks import add_history_record_update
from core.utils import get_serialized_models_diff
from core.logging import logger, events
import json
from notifications.tasks import create_notification
from notifications import events as notification_event

from history.models import ResourceHistoryModel
from history.serializers import ResourceHistorySerializer
from notifications.viewsets import SubscribableVieset
from discussions.views import HasDiscussionViewsetMixin


class ResourceWithEditSuggestionVieset(ModelViewsetWithEditSuggestion, VotableVieset, SubscribableVieset, HasDiscussionViewsetMixin):
    m2m_fields = None

    def create(self, request, *args, **kwargs):
        try:
            response = super(ResourceWithEditSuggestionVieset, self).create(request, *args, **kwargs)
            # we have to resync to elasticsearch because we now have finished adding the m2m data
            instance = self.serializer_class.Meta.model.objects.get(pk=response.data['pk'])
            instance.save()
            create_notification(instance._meta.model, instance.pk, request.user.pk, notification_event.VERB_CREATE)
            logger.log_resource_op(instance, request, events.OP_CREATE)
            response.data['success'] = {
                'message': f'<div class="message">Keep up the good work!</div>'
                           f'<div class="score-info">'
                           f'You gained <span className="user-reward">{rewards.RESOURCE_CREATE}</span> points! '
                           f'Your score is now <span className="user-score">{request.user.positive_score}</span>'
                           f'</div>',
            }
            return response
        except ValidationError as e:
            logger.log_resource_error(serializeValidationError(e), request, events.OP_CREATE)
            return Response(status=502, data={
                'error': serializeValidationError(e)
            })
        except Exception as e:
            logger.log_resource_error(str(e), request, events.OP_CREATE)
            mail_admins(
                subject=f'Error Creating Resource: {self.request.META["PATH_INFO"]}',
                message=f'ERROR: \n'
                        f'{e}\n\n'
                        f'REQUEST DATA:\n'
                        f'{self.request.data}'
            )
            return Response(status=502)

    def perform_create(self, serializer):
        resource = serializer.save(author=self.request.user)
        self.request.user.positive_score += rewards.RESOURCE_CREATE
        self.request.user.save()
        return resource

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if self.request.user.is_staff or instance.author == self.request.user:
            try:
                old_record = self.serializer_class(instance).data
                response = super(ResourceWithEditSuggestionVieset, self).update(request, *args, **kwargs)
                create_notification(instance._meta.model, instance.pk, request.user.pk, notification_event.VERB_UPDATE)
                logger.log_resource_op(instance, self.request, events.OP_UPDATE)
                if response.status_code == 200:
                    # we run the task creating the history object
                    new_record = response.data
                    diff_text = json.dumps(get_serialized_models_diff(old_record, new_record, old_record.keys()))
                    add_history_record_update(
                        model=self.serializer_class.Meta.model,
                        pk=instance.pk,
                        changes_text=diff_text,
                        edit_reason=request.data['edit_suggestion_reason'],
                        author_id=request.user.pk,
                        operation_source=ResourceHistoryModel.OperationSource.DIRECT,
                        operation_type=ResourceHistoryModel.OperationType.UPDATE
                    )
                return response
            except ValidationError as e:
                raise e
            except Exception as e:
                logger.log_resource_error(str(e), request, events.OP_UPDATE)
                mail_admins(
                    subject=f'Error Updating Resource: {self.request.META["PATH_INFO"]}',
                    message=f'ERROR: \n'
                            f'{e}\n\n'
                            f'REQUEST DATA:\n'
                            f'{self.request.data}'
                )
                return Response(status=502, data=str(e))
        else:
            try:
                serialized_instance = self.get_serializer(instance=instance, data=request.data)
                validated_data = serialized_instance.run_validation(request.data)
                edsug = self.edit_suggestion_perform_create(instance, validated_data)
                edsug_serializer = self.serializer_class.get_edit_suggestion_serializer()
                create_notification(instance._meta.model, instance.pk, request.user.pk,
                                    notification_event.VERB_EDIT_NEW)
                logger.log_resource_edit_suggestion_created(instance, request)
                return Response(edsug_serializer(edsug).data, status=HTTP_209_EDIT_SUGGESTION_CREATED)
            except ValidationError as e:
                raise e
            except Exception as e:
                logger.log_resource_error(str(e), request, events.EDIT_SUGGESTION)
                mail_admins(
                    subject=f'Error Creating Edit Suggestion for Resource: {self.request.META["PATH_INFO"]}',
                    message=f'ERROR: \n'
                            f'{e}\n\n'
                            f'REQUEST DATA:\n'
                            f'{self.request.data}'
                )
                return Response(status=502)

    @action(methods=['POST'], detail=True)
    def edit_suggestion_publish(self, request, *args, **kwargs):
        try:
            parent = self.get_object()
            edit_instance = parent.edit_suggestions.get(
                pk=request.data['edit_suggestion_id'],
                edit_suggestion_parent=parent
            )
            edit_instance.edit_suggestion_publish(request.user)
            create_notification(parent._meta.model, parent.pk, request.user.pk, notification_event.VERB_EDIT_PUBLISH)
            logger.log_resource_op(parent, self.request, events.OP_UPDATE_EDIT_PUBLISH)
            # we run the create history update task
            old_record = self.serializer_class(parent).data
            parent.refresh_from_db()  # retrieve new data from db
            new_record = self.serializer_class(parent).data
            diff_text = json.dumps(get_serialized_models_diff(old_record, new_record, old_record.keys()))
            add_history_record_update(
                model=self.serializer_class.Meta.model,
                pk=parent.pk,
                changes_text=diff_text,
                author_id=edit_instance.edit_suggestion_author.pk,
                edit_published_by_id=request.user.pk,
                edit_reason=edit_instance.edit_suggestion_reason,
                operation_source=ResourceHistoryModel.OperationSource.EDIT_SUGGESTION,
                operation_type=ResourceHistoryModel.OperationType.UPDATE
            )
        except PermissionDenied as e:
            return Response(status=403, data={
                'error': True,
                'message': str(e)
            })
        except Exception as e:
            logger.log_resource_error(str(e), request, events.EDIT_SUGGESTION)
            return Response(status=401, data={
                'error': True,
                'message': str(e)
            })
        return Response(status=200, data={
            'error': False,
            'message': 'Edit suggestion has been published! Resource has been updated.'
        })

    @action(methods=['POST'], detail=True)
    def edit_suggestion_reject(self, request, *args, **kwargs):
        parent = self.get_object()
        response = super(ResourceWithEditSuggestionVieset, self).edit_suggestion_reject(request, *args, **kwargs)
        create_notification(parent._meta.model, parent.pk, request.user.pk, notification_event.VERB_EDIT_REJECT)
        logger.log_resource_edit_suggestion_operation(self.get_object(),
                                                      f'REJECT - {request.data["edit_suggestion_reject_reason"]}',
                                                      request)
        return response

    @action(methods=['GET'], detail=True)
    def history(self, request, *args, **kwargs):
        page_size = int(request.GET.get('resultsPerPage', 10))
        page = int(request.GET.get('currentPage', 1))
        instance = self.get_object()
        paginated_results = Paginator(instance.history.order_by('-created').all(), page_size)
        page = paginated_results.page(page)
        serialized_history = ResourceHistorySerializer(page, many=True)
        return Response({
            'items': serialized_history.data,
            'stats': {'total': paginated_results.count}
        })

    def perform_destroy(self, instance):
        if self.request.user.is_staff or instance.author == self.request.user:
            create_notification(instance._meta.model, instance.pk, self.request.user.pk, notification_event.VERB_DELETE)
            logger.log_resource_op(instance, self.request, events.OP_SOFT_DELETE)
            return super(ResourceWithEditSuggestionVieset, self).perform_destroy(instance)
        else:
            raise PermissionDenied('Only staff or resource owner can delete the resource.')


class EditSuggestionViewset(VotableVieset):
    """
    should only permit voting, editing and detail
    """

    def create(self, request, *args, **kwargs):
        raise PermissionDenied('Edit suggestions are to be created through the parent resource.')

    def list(self, request, *args, **kwargs):
        return PermissionDenied('Edit suggestions are to be viewed through the parent resource.')

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if self.request.user.is_staff or instance.edit_suggestion_author == self.request.user:
            logger.log_resource_edit_suggestion_operation(instance, events.OP_UPDATE, self.request)
            return super(EditSuggestionViewset, self).update(request, *args, **kwargs)
        else:
            raise PermissionDenied('Only staff or resource owner can update the edit suggestion.')

    def perform_destroy(self, instance):
        if self.request.user.is_staff or instance.edit_suggestion_author == self.request.user:
            create_notification(
                instance.edit_suggestion_parent._meta.model,
                instance.edit_suggestion_parent.parent.pk,
                self.request.user.pk, notification_event.VERB_EDIT_DELETE
            )
            logger.log_resource_edit_suggestion_operation(instance, events.OP_DELETE, self.request)
            return super(EditSuggestionViewset, self).perform_destroy(instance)
        else:
            raise PermissionDenied('Only staff or resource owner can delete the edit suggestion.')
