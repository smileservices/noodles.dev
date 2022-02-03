from django.db import models
from mptt.models import MPTTModel
from mptt.fields import TreeForeignKey

from django.contrib.postgres import fields
from django.contrib.contenttypes.fields import GenericForeignKey, ContentType

from core.abstract_models import DateTimeModelMixin
from votable.models import VotableMixin
from users.models import CustomUser


# any model can have a discussion therefore we will use a generic relation
# tree like structured, use mptt
# votable

class PostQueryset(models.QuerySet):
    def annotate_with_replies_count(self):
        return self.annotate(replies_count=models.Count('replies'))


class PostManager(models.Manager):

    def get_queryset(self):
        return PostQueryset(self.model, using=self.db)\
            .annotate_with_replies_count()\
            .order_by('-created_at')

    def root_posts(self):
        return self.get_queryset().filter(parent=None)


class Post(MPTTModel, DateTimeModelMixin, VotableMixin):
    objects = PostManager()
    parent = TreeForeignKey(
        'self',
        on_delete=models.CASCADE,
        related_name='replies',
        null=True, blank=True, db_index=True
    )
    author = models.ForeignKey(CustomUser, on_delete=models.DO_NOTHING, db_index=True)
    active = models.BooleanField(default=True)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    text = models.TextField()
    meta = fields.JSONField(null=True, blank=True)

    class Meta:
        # order_insertion_by = ['created_at']
        index_together = ('content_type', 'object_id')

    def __str__(self):
        return f"{self.author} at {self.created_at} on \"{self.content_object}\" with {self.replies.count()} replies"
