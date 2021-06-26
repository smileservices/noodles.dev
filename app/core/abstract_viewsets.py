from votable.viewsets import VotableVieset
from django_edit_suggestion.rest_views import ModelViewsetWithEditSuggestion
from app.settings import rewards
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, ValidationError
from core.status import HTTP_209_EDIT_SUGGESTION_CREATED
from django.core.mail import mail_admins
from core.serializers import serializeValidationError


class ResourceWithEditSuggestionVieset(ModelViewsetWithEditSuggestion, VotableVieset):
    m2m_fields = None

    def create(self, request, *args, **kwargs):
        try:
            response = super(ResourceWithEditSuggestionVieset, self).create(request, *args, **kwargs)
            # we have to resync to elasticsearch because we now have finished adding the m2m data
            instance = self.serializer_class.Meta.model.objects.get(pk=response.data['pk'])
            instance.save()
            response.data['success'] = {
                'message': f'<div class="message">Keep up the good work!</div>'
                           f'<div class="score-info">'
                           f'You gained <span className="user-reward">{rewards.RESOURCE_CREATE}</span> points! '
                           f'Your score is now <span className="user-score">{request.user.positive_score}</span>'
                           f'</div>',
            }
            return response
        except ValidationError as e:
            return Response(status=502, data={
                'error': serializeValidationError(e)
            })
        except Exception as e:
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
                return super(ResourceWithEditSuggestionVieset, self).update(request, *args, **kwargs)
            except ValidationError as e:
                raise e
            except Exception as e:
                mail_admins(
                    subject=f'Error Updating Resource: {self.request.META["PATH_INFO"]}',
                    message=f'ERROR: \n'
                            f'{e}\n\n'
                            f'REQUEST DATA:\n'
                            f'{self.request.data}'
                )
                return Response(status=502)
        else:
            try:
                serialized_instance = self.get_serializer(instance=instance, data=request.data)
                validated_data = serialized_instance.run_validation(request.data)
                edsug = self.edit_suggestion_perform_create(instance, validated_data)
                edsug_serializer = self.serializer_class.get_edit_suggestion_serializer()
                return Response(edsug_serializer(edsug).data, status=HTTP_209_EDIT_SUGGESTION_CREATED)
            except ValidationError as e:
                raise e
            except Exception as e:
                mail_admins(
                    subject=f'Error Creating Edit Suggestion for Resource: {self.request.META["PATH_INFO"]}',
                    message=f'ERROR: \n'
                            f'{e}\n\n'
                            f'REQUEST DATA:\n'
                            f'{self.request.data}'
                )
                return Response(status=502)

    def perform_destroy(self, instance):
        if self.request.user.is_staff or instance.author == self.request.user:
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
            return super(EditSuggestionViewset, self).update(request, *args, **kwargs)
        else:
            raise PermissionDenied('Only staff or resource owner can update the edit suggestion.')

    def perform_destroy(self, instance):
        if self.request.user.is_staff or instance.edit_suggestion_author == self.request.user:
            return super(EditSuggestionViewset, self).perform_destroy(instance)
        else:
            raise PermissionDenied('Only staff or resource owner can delete the edit suggestion.')
