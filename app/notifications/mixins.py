from django.db import models
from django.contrib.contenttypes.fields import GenericRelation
from .models import Subscribers
from .tasks import subscribe, unsubscribe


class HasSubscribersMixin(models.Model):
    subscribers = GenericRelation(Subscribers)

    class Meta:
        abstract = True

    def subscribe(self, user):
        subscribe(self, user)

    def unsubscribe(self, user):
        unsubscribe(self, user)
