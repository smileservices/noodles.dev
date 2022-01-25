from rest_framework import serializers
from . import models


class NotificationSerializer(serializers.ModelSerializer):
    queryset = models.Notifications.objects

    class Meta:
        model = models.Notifications
        fields = ['message', 'seen', 'datetime']


class SubscribtionSerializer(serializers.ModelSerializer):
    queryset = models.Subscribers.objects
    name = serializers.SerializerMethodField()
    absolute_url = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()

    class Meta:
        model = models.Subscribers
        fields = ['name', 'absolute_url', 'type']

    def get_name(self, obj):
        return obj.content_object.name

    def get_absolute_url(self, obj):
        return obj.content_object.absolute_url

    def get_type(self, obj):
        return obj.content_type.name
