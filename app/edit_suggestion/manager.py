from __future__ import unicode_literals

from django.db import models
from django.utils import timezone

from edit_suggestion.utils import get_change_reason_from_object


class EditSuggestionDescriptor(object):
    def __init__(self, model):
        self.model = model

    def __get__(self, instance, owner):
        if instance is None:
            return EditSuggestionManager(self.model)
        return EditSuggestionManager(self.model, instance)


class EditSuggestionManager(models.Manager):
    def __init__(self, model, instance=None):
        super(EditSuggestionManager, self).__init__()
        self.model = model
        self.instance = instance

    def get_super_queryset(self):
        return super(EditSuggestionManager, self).get_queryset()

    def get_queryset(self):
        qs = self.get_super_queryset()
        if self.instance is None:
            return qs

        if isinstance(self.instance._meta.pk, models.ForeignKey):
            key_name = self.instance._meta.pk.name + "_id"
        else:
            key_name = self.instance._meta.pk.name
        return self.get_super_queryset().filter(**{key_name: self.instance.pk})

    def most_recent(self):
        """
        Returns the most recent copy of the instance available in the history.
        """
        if not self.instance:
            raise TypeError(
                "Can't use most_recent() without a {} instance.".format(
                    self.model._meta.object_name
                )
            )
        tmp = []
        excluded_fields = getattr(self.model, "_editable_suggestion_excluded_fields", [])

        for field in self.instance._meta.fields:
            if field.name in excluded_fields:
                continue
            if isinstance(field, models.ForeignKey):
                tmp.append(field.name + "_id")
            else:
                tmp.append(field.name)
        fields = tuple(tmp)
        try:
            values = self.get_queryset().values(*fields)[0]
        except IndexError:
            raise self.instance.DoesNotExist(
                "%s has no historical record." % self.instance._meta.object_name
            )
        return self.instance.__class__(**values)

    def as_of(self, date):
        """Get a snapshot as of a specific date.

        Returns an instance, or an iterable of the instances, of the
        original model with all the attributes set according to what
        was present on the object on the date provided.
        """
        if not self.instance:
            return self._as_of_set(date)
        queryset = self.get_queryset().filter(editable_suggestion_date__lte=date)
        try:
            edit_obj = queryset[0]
        except IndexError:
            raise self.instance.DoesNotExist(
                "%s had not yet been created." % self.instance._meta.object_name
            )
        if edit_obj.editable_suggestion_type == "-":
            raise self.instance.DoesNotExist(
                "%s had already been deleted." % self.instance._meta.object_name
            )
        return edit_obj.instance

    def _as_of_set(self, date):
        model = type(self.model().instance)  # a bit of a hack to get the model
        pk_attr = model._meta.pk.name
        queryset = self.get_queryset().filter(editable_suggestion_date__lte=date)
        for original_pk in set(queryset.order_by().values_list(pk_attr, flat=True)):
            changes = queryset.filter(**{pk_attr: original_pk})
            last_change = changes.latest("editable_suggestion_date")
            if changes.filter(
                editable_suggestion_date=last_change.editable_suggestion_date, editable_suggestion_type="-"
            ).exists():
                continue
            yield last_change.instance
