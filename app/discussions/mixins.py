from django.db import models
from django.contrib.contenttypes.fields import GenericRelation


class HasDiscussionsMixin(models.Model):
    discussions = GenericRelation('discussions.Post')

    class Meta:
        abstract = True
