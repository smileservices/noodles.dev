from django.db import models
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes import fields
from users.models import CustomUser


# Create your models here.
class ResourceHistoryModel(models.Model):
    class OperationSource(models.IntegerChoices):
        DIRECT = (0, 'direct')
        EDIT_SUGGESTION = (1, 'edit_suggestion')
        AUTO = (2, 'automatic')

    class OperationType(models.IntegerChoices):
        CREATE = (0, 'create')
        UPDATE = (1, 'update')
        DELETE = (2, 'delete')

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, db_index=True)
    object_id = models.PositiveIntegerField(db_index=True)
    content_object = fields.GenericForeignKey('content_type', 'object_id')
    changes = models.TextField(blank=True, null=True)
    author = models.ForeignKey(CustomUser, on_delete=models.DO_NOTHING, db_index=True, null=True, blank=True,
                               related_name='author')
    edit_published_by = models.ForeignKey(CustomUser, on_delete=models.DO_NOTHING, db_index=True, null=True, blank=True,
                                          related_name='edit_publisher')  # the user that publishes the edit suggestion
    edit_reason = models.fields.TextField(blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True, db_index=True)
    operation_source = models.IntegerField(default=0, choices=OperationSource.choices, db_index=True)
    operation_type = models.IntegerField(default=0, choices=OperationType.choices, db_index=True)

    @property
    def operation_source_label(self):
        return self.OperationSource(self.operation_source).label

    @property
    def operation_type_label(self):
        return self.OperationType(self.operation_type).label
