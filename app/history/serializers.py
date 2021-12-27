from rest_framework import serializers
from users.serializers import UserSerializerMinimal
from history.models import ResourceHistoryModel


class ResourceHistorySerializer(serializers.ModelSerializer):
    queryset = ResourceHistoryModel.objects.all()
    author = UserSerializerMinimal(read_only=True)
    edit_published_by = UserSerializerMinimal(read_only=True)
    content_object = serializers.SerializerMethodField()

    class Meta:
        model = ResourceHistoryModel
        fields = ['pk', 'content_object', 'changes', 'author', 'edit_published_by', 'edit_reason', 'created',
                  'operation_source_label', 'operation_type_label']

    def get_content_object(self, instance):
        return str(instance.content_object)
