from rest_framework.serializers import ModelSerializer
from rest_framework.fields import SerializerMethodField
from django.db.models import Q

# from easyaudit.models import CRUDEvent


# class ActivitySerializer(ModelSerializer):
#     queryset = CRUDEvent.objects.all()
#     resource = SerializerMethodField()
#     event_type = SerializerMethodField()
#
#     class Meta:
#         model = CRUDEvent
#         fields = ['pk', 'resource', 'object_id', 'event_type', 'user', 'datetime', 'changed_fields', 'object_json_repr']
#
#     def get_resource(self, obj):
#         return obj.content_type.model
#
#     def get_event_type(self, obj):
#         for et in obj.TYPES:
#             if obj.event_type == et[0]:
#                 return et[1]
