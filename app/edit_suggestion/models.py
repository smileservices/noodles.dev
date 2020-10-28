from __future__ import unicode_literals

import copy
import importlib
import threading
import uuid
import warnings

import six
from django.apps import apps
from django.conf import settings
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from django.db import models
from django.db.models import Q
from django.db.models.fields.proxy import OrderWrt
from django.forms.models import model_to_dict
from django.urls import reverse
from django.utils.text import format_lazy
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from django.utils.encoding import smart_str
from django.contrib.postgres.fields import ArrayField

from edit_suggestion import utils
from . import exceptions
from .manager import EditSuggestionDescriptor
from .utils import get_change_reason_from_object
from .signals import post_create_edit_suggestion, pre_create_edit_suggestion

registered_models = {}


def _default_get_user(request, **kwargs):
    try:
        return request.user
    except AttributeError:
        return None


def _edit_suggestion_user_getter(edit_suggestion_instance):
    if edit_suggestion_instance.edit_suggestion_user_id is None:
        return None
    User = get_user_model()
    try:
        return User.objects.get(pk=edit_suggestion_instance.edit_suggestion_user_id)
    except User.DoesNotExist:
        return None


def _edit_suggestion_user_setter(edit_suggestion_instance, user):
    if user is not None:
        edit_suggestion_instance.edit_suggestion_user_id = user.pk


class EditSuggestion(object):
    thread = threading.local()

    class Status(models.IntegerChoices):
        UNDER_REVIEWS = (0, 'under review')
        PUBLISHED = (1, 'published')
        REJECTED = (2, 'rejected')

    def __init__(
            self,
            verbose_name=None,
            bases=(models.Model,),
            user_related_name="+",
            table_name=None,
            inherit=False,
            excluded_fields=None,
            edit_suggestion_id_field=None,
            edit_suggestion_change_reason_field=None,
            user_model=None,
            get_user=_default_get_user,
            cascade_delete_edit_suggestion=False,
            custom_model_name=None,
            app=None,
            edit_suggestion_user_id_field=None,
            edit_suggestion_user_getter=_edit_suggestion_user_getter,
            edit_suggestion_user_setter=_edit_suggestion_user_setter,
            related_name=None,
            use_base_model_db=False,
            user_db_constraint=True,
    ):
        self.user_set_verbose_name = verbose_name
        self.user_related_name = user_related_name
        self.user_db_constraint = user_db_constraint
        self.table_name = table_name
        self.inherit = inherit
        self.edit_suggestion_id_field = edit_suggestion_id_field
        self.edit_suggestion_change_reason_field = edit_suggestion_change_reason_field
        self.user_model = user_model
        self.get_user = get_user
        self.cascade_delete_edit_suggestion = cascade_delete_edit_suggestion
        self.custom_model_name = custom_model_name
        self.app = app
        self.user_id_field = edit_suggestion_user_id_field
        self.user_getter = edit_suggestion_user_getter
        self.user_setter = edit_suggestion_user_setter
        self.related_name = related_name
        self.use_base_model_db = use_base_model_db

        if excluded_fields is None:
            excluded_fields = []
        self.excluded_fields = excluded_fields
        try:
            if isinstance(bases, six.string_types):
                raise TypeError
            self.bases = (EditSuggestionChanges,) + tuple(bases)
        except TypeError:
            raise TypeError("The `bases` option must be a list or a tuple.")

    def contribute_to_class(self, cls, name):
        self.manager_name = name
        self.module = cls.__module__
        self.cls = cls
        models.signals.class_prepared.connect(self.finalize, weak=False)

        if cls._meta.abstract and not self.inherit:
            msg = (
                "EditSuggestion added to abstract model ({}) without "
                "inherit=True".format(self.cls.__name__)
            )
            warnings.warn(msg, UserWarning)

    def finalize(self, sender, **kwargs):
        inherited = False
        if self.cls is not sender:  # set in concrete
            inherited = self.inherit and issubclass(sender, self.cls)
            if not inherited:
                return  # set in abstract

        if hasattr(sender._meta, "simple_edit_suggestion_manager_attribute"):
            raise exceptions.MultipleRegistrationsError(
                "{}.{} registered multiple times for editable suggestion tracking.".format(
                    sender._meta.app_label, sender._meta.object_name
                )
            )
        edit_suggestion_model = self.create_edit_suggestion_model(sender, inherited)
        if inherited:
            # Make sure editable suggestion model is in same module as concrete model
            module = importlib.import_module(edit_suggestion_model.__module__)
        else:
            module = importlib.import_module(self.module)
        setattr(module, edit_suggestion_model.__name__, edit_suggestion_model)

        descriptor = EditSuggestionDescriptor(edit_suggestion_model)
        setattr(sender, self.manager_name, descriptor)
        sender._meta.simple_edit_suggestion_manager_attribute = self.manager_name

    def get_edit_suggestion_model_name(self, model):
        if not self.custom_model_name:
            return "EditSuggestion{}".format(model._meta.object_name)
        # Must be trying to use a custom edit_suggestion model name
        if callable(self.custom_model_name):
            name = self.custom_model_name(model._meta.object_name)
        else:
            #  simple string
            name = self.custom_model_name
        # Desired class name cannot be same as the model it is tracking
        if not (
                name.lower() == model._meta.object_name.lower()
                and model.__module__ == self.module
        ):
            return name
        raise ValueError(
            "The 'custom_model_name' option '{}' evaluates to a name that is the same "
            "as the model it is tracking. This is not permitted.".format(
                self.custom_model_name
            )
        )

    def create_edit_suggestion_model(self, model, inherited):
        """
        Creates an editable suggestion model to associate with the model provided.
        """
        attrs = {
            "__module__": self.module,
            "_edit_suggestion_excluded_fields": self.excluded_fields,
        }

        app_module = "%s.models" % model._meta.app_label

        if inherited:
            # inherited use models module
            attrs["__module__"] = model.__module__
        elif model.__module__ != self.module:
            # registered under different app
            attrs["__module__"] = self.module
        elif app_module != self.module:
            # Abuse an internal API because the app registry is loading.
            app = apps.app_configs[model._meta.app_label]
            models_module = app.name
            attrs["__module__"] = models_module

        fields = self.copy_fields(model)
        attrs.update(fields)
        attrs.update(self.get_extra_fields(model, fields))
        # type in python2 wants str as a first argument
        attrs.update(Meta=type(str("Meta"), (), self.get_meta_options(model)))
        if self.table_name is not None:
            attrs["Meta"].db_table = self.table_name

        # Set as the default then check for overrides
        name = self.get_edit_suggestion_model_name(model)

        registered_models[model._meta.db_table] = model
        edit_suggestion_model = type(str(name), self.bases, attrs)
        return edit_suggestion_model

    def fields_included(self, model):
        fields = []
        for field in model._meta.fields:
            if field.name not in self.excluded_fields:
                fields.append(field)
        return fields

    def copy_fields(self, model):
        """
        Creates copies of the model's original fields, returning
        a dictionary mapping field name to copied field object.
        """
        fields = {}
        for field in self.fields_included(model):
            field = copy.copy(field)
            field.remote_field = copy.copy(field.remote_field)
            if isinstance(field, OrderWrt):
                # OrderWrt is a proxy field, switch to a plain IntegerField
                field.__class__ = models.IntegerField
            if isinstance(field, models.ForeignKey):
                old_field = field
                old_swappable = old_field.swappable
                old_field.swappable = False
                try:
                    _name, _path, args, field_args = old_field.deconstruct()
                finally:
                    old_field.swappable = old_swappable
                if getattr(old_field, "one_to_one", False) or isinstance(
                        old_field, models.OneToOneField
                ):
                    FieldType = models.ForeignKey
                else:
                    FieldType = type(old_field)

                # If field_args['to'] is 'self' then we have a case where the object
                # has a foreign key to itself. If we pass the historical record's
                # field to = 'self', the foreign key will point to an historical
                # record rather than the base record. We can use old_field.model here.
                if field_args.get("to", None) == "self":
                    field_args["to"] = old_field.model

                # Override certain arguments passed when creating the field
                # so that they work for the historical field.
                field_args.update(
                    db_constraint=False,
                    related_name="+",
                    null=True,
                    blank=True,
                    primary_key=False,
                    db_index=True,
                    serialize=True,
                    unique=False,
                    on_delete=models.DO_NOTHING,
                )
                field = FieldType(*args, **field_args)
                field.name = old_field.name
            else:
                transform_field(field)
            fields[field.name] = field
        return fields

    def _get_edit_suggestion_change_reason_field(self):
        if self.edit_suggestion_change_reason_field:
            # User specific field from init
            edit_suggestion_change_reason_field = self.edit_suggestion_change_reason_field
        elif getattr(
                settings, "EDITABLE_SUGGESTION_CHANGE_REASON_USE_TEXT_FIELD", False
        ):
            # Use text field with no max length, not enforced by DB anyways
            edit_suggestion_change_reason_field = models.TextField(null=True)
        else:
            # Current default, with max length
            edit_suggestion_change_reason_field = models.CharField(max_length=100, null=True)

        return edit_suggestion_change_reason_field

    def _get_edit_suggestion_id_field(self):
        if self.edit_suggestion_id_field:
            edit_suggestion_id_field = self.edit_suggestion_id_field
            edit_suggestion_id_field.primary_key = True
            edit_suggestion_id_field.editable = False
        elif getattr(settings, "SIMPLE_HISTORY_HISTORY_ID_USE_UUID", False):
            edit_suggestion_id_field = models.UUIDField(
                primary_key=True, default=uuid.uuid4, editable=False
            )
        else:
            edit_suggestion_id_field = models.AutoField(primary_key=True)

        return edit_suggestion_id_field

    def _get_edit_suggestion_user_fields(self):
        if self.user_id_field is not None:
            # Tracking user using explicit id rather than Django ForeignKey
            edit_suggestion_user_fields = {
                "edit_suggestion_user": property(self.user_getter, self.user_setter),
                "edit_suggestion_user_id": self.user_id_field,
            }
        else:
            user_model = self.user_model or getattr(
                settings, "AUTH_USER_MODEL", "auth.User"
            )

            edit_suggestion_user_fields = {
                "edit_suggestion_user": models.ForeignKey(
                    user_model,
                    null=True,
                    related_name=self.user_related_name,
                    on_delete=models.SET_NULL,
                    db_constraint=self.user_db_constraint,
                )
            }

        return edit_suggestion_user_fields

    def _get_edit_suggestion_related_field(self, model):
        if self.related_name:
            if self.manager_name == self.related_name:
                raise exceptions.RelatedNameConflictError(
                    "The related name must not be called like the edit_suggestion manager."
                )
            return {
                "edit_suggestion_relation": models.ForeignKey(
                    model,
                    on_delete=models.DO_NOTHING,
                    related_name=self.related_name,
                    db_constraint=False,
                )
            }
        else:
            return {}

    def get_extra_fields(self, model, fields):
        """Return dict of extra fields added to the edit suggestion record model"""

        def revert_url(self):
            """URL for this change in the default admin site."""
            opts = model._meta
            app_label, model_name = opts.app_label, opts.model_name
            return reverse(
                "%s:%s_%s_edit_suggestion" % (admin.site.name, app_label, model_name),
                args=[getattr(self, opts.pk.attname), self.edit_suggestion_id],
            )

        def get_instance(self):
            attrs = {
                field.attname: getattr(self, field.attname) for field in fields.values()
            }
            if self._edit_suggestion_excluded_fields:
                excluded_attnames = [
                    model._meta.get_field(field).attname
                    for field in self._edit_suggestion_excluded_fields
                ]
                try:
                    values = (
                        model.objects.filter(pk=getattr(self, model._meta.pk.attname))
                            .values(*excluded_attnames)
                            .get()
                    )
                except ObjectDoesNotExist:
                    pass
                else:
                    attrs.update(values)
            return model(**attrs)

        def get_next_record(self):
            """
            Get the next edit_suggestion record for the instance. `None` if last.
            """
            edit_suggestion = utils.get_edit_suggestion_manager_for_model(self.instance)
            return (
                edit_suggestion.filter(Q(edit_suggestion_date__gt=self.edit_suggestion_date))
                    .order_by("edit_suggestion_date")
                    .first()
            )

        def get_prev_record(self):
            """
            Get the previous edit_suggestion record for the instance. `None` if first.
            """
            edit_suggestion = utils.get_edit_suggestion_manager_for_model(self.instance)
            return (
                edit_suggestion.filter(Q(edit_suggestion_date__lt=self.edit_suggestion_date))
                    .order_by("edit_suggestion_date")
                    .last()
            )

        def get_default_edit_suggestion_user(instance):
            """
            Returns the user specified by `get_user` method for manually creating
            historical objects
            """
            return self.get_edit_suggestion_user(instance)

        extra_fields = {
            "edit_suggestion_id": self._get_edit_suggestion_id_field(),
            "edit_suggestion_date": models.DateTimeField(),
            "edit_suggestion_change_reason": self._get_edit_suggestion_change_reason_field(),
            "edit_suggestion_type": models.CharField(
                max_length=1,
                choices=(("+", _("Created")), ("~", _("Changed")), ("-", _("Deleted"))),
            ),
            "edit_suggestion_object": EditSuggestionObjectDescriptor(
                model, self.fields_included(model)
            ),
            "instance": property(get_instance),
            "instance_type": model,
            "next_record": property(get_next_record),
            "prev_record": property(get_prev_record),
            "revert_url": revert_url,
            "__str__": lambda self: "{} as of {}".format(
                self.edit_suggestion_object, self.edit_suggestion_date
            ),
            "get_default_edit_suggestion_user": staticmethod(get_default_edit_suggestion_user),
            "status": models.IntegerField(default=0, choices=self.Status.choices, db_index=True),
        }

        extra_fields.update(self._get_edit_suggestion_related_field(model))
        extra_fields.update(self._get_edit_suggestion_user_fields())

        return extra_fields

    def get_meta_options(self, model):
        """
        Returns a dictionary of fields that will be added to
        the Meta inner class of the historical record model.
        """
        meta_fields = {
            "ordering": ("-edit_suggestion_date", "-edit_suggestion_id"),
            "get_latest_by": "edit_suggestion_date",
        }
        if self.user_set_verbose_name:
            name = self.user_set_verbose_name
        else:
            name = format_lazy("historical {}", smart_str(model._meta.verbose_name))
        meta_fields["verbose_name"] = name
        if self.app:
            meta_fields["app_label"] = self.app
        return meta_fields

    def get_edit_suggestion_user(self, instance):
        """Get the modifying user from instance or middleware."""
        try:
            return instance._edit_suggestion_user
        except AttributeError:
            request = None
            try:
                if self.thread.request.user.is_authenticated:
                    request = self.thread.request
            except AttributeError:
                pass

        return self.get_user(instance=instance, request=request)


def transform_field(field):
    """Customize field appropriately for use in edit suggestion model"""
    field.name = field.attname
    if isinstance(field, models.BigAutoField):
        field.__class__ = models.BigIntegerField
    elif isinstance(field, models.AutoField):
        field.__class__ = models.IntegerField

    elif isinstance(field, models.FileField):
        # Don't copy file, just path.
        if getattr(settings, "EDIT_SUGGESTION_FILEFIELD_TO_CHARFIELD", False):
            field.__class__ = models.CharField
        else:
            field.__class__ = models.TextField

    #  instance shouldn't change create/update timestamps
    field.auto_now = False
    field.auto_now_add = False

    if field.primary_key or field.unique:
        # Unique fields can no longer be guaranteed unique,
        # but they should still be indexed for faster lookups.
        field.primary_key = False
        field._unique = False
        field.db_index = True
        field.serialize = True


class EditSuggestionObjectDescriptor(object):
    def __init__(self, model, fields_included):
        self.model = model
        self.fields_included = fields_included

    def __get__(self, instance, owner):
        values = {f.attname: getattr(instance, f.attname) for f in self.fields_included}
        return self.model(**values)


class EditSuggestionChanges(object):
    def diff_against(self, old_edit_suggestion):
        if not isinstance(old_edit_suggestion, type(self)):
            raise TypeError(
                ("unsupported type(s) for diffing: " "'{}' and '{}'").format(
                    type(self), type(old_edit_suggestion)
                )
            )

        changes = []
        changed_fields = []
        old_values = model_to_dict(old_edit_suggestion.instance)
        current_values = model_to_dict(self.instance)
        for field, new_value in current_values.items():
            if field in old_values:
                old_value = old_values[field]
                if old_value != new_value:
                    change = ModelChange(field, old_value, new_value)
                    changes.append(change)
                    changed_fields.append(field)

        return ModelDelta(changes, changed_fields, old_edit_suggestion, self)


class ModelChange(object):
    def __init__(self, field_name, old_value, new_value):
        self.field = field_name
        self.old = old_value
        self.new = new_value


class ModelDelta(object):
    def __init__(self, changes, changed_fields, old_record, new_record):
        self.changes = changes
        self.changed_fields = changed_fields
        self.old_record = old_record
        self.new_record = new_record
