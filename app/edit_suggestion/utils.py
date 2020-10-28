import warnings

import django
from django.db import transaction
from django.forms.models import model_to_dict

from edit_suggestion.exceptions import NoEditableSuggestionModelError


def update_change_reason(instance, reason):
    attrs = {}
    model = type(instance)
    manager = instance if instance.id is not None else model
    editable_suggestion = get_edit_suggestion_manager_for_model(manager)
    edit_suggestion_fields = [field.attname for field in editable_suggestion.model._meta.fields]
    for field in instance._meta.fields:
        if field.attname not in edit_suggestion_fields:
            continue
        value = getattr(instance, field.attname)
        if field.primary_key is True:
            if value is not None:
                attrs[field.attname] = value
        else:
            attrs[field.attname] = value

    record = editable_suggestion.filter(**attrs).order_by("-edit_suggestion_date").first()
    record.edit_suggestion_change_reason = reason
    record.save()


def get_edit_suggestion_manager_for_model(model):
    """Return the ditable suggestion manager for a given app model."""
    try:
        manager_name = model._meta.simple_edit_suggestion_manager_attribute
    except AttributeError:
        raise NoEditableSuggestionModelError(
            "Cannot find a ditable suggestion model for {model}.".format(model=model)
        )
    return getattr(model, manager_name)


def get_edit_suggestion_model_for_model(model):
    """Return the editable suggestion model for a given app model."""
    return get_edit_suggestion_manager_for_model(model).model


def get_change_reason_from_object(obj):
    if hasattr(obj, "_change_reason"):
        return getattr(obj, "_change_reason")

    if hasattr(obj, "changeReason"):
        warning_msg = (
            "Using the attr changeReason to populate history_change_reason is"
            " deprecated in 2.10.0 and will be removed in 3.0.0. Use "
            "_change_reason instead. "
        )
        warnings.warn(warning_msg, DeprecationWarning)
        return getattr(obj, "changeReason")

    return None
