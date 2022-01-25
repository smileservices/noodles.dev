from django.db import models
from django.contrib.postgres import fields
from django.contrib.contenttypes.fields import GenericForeignKey, ContentType
from users.models import CustomUser


class Subscribers(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')
    users = fields.ArrayField(models.IntegerField(), default=list)

    class Meta:
        index_together = ('content_type', 'object_id')


class Notifications(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    message = models.TextField()
    seen = models.BooleanField(default=False)
    datetime = models.DateTimeField(auto_now=True)
