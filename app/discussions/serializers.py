from rest_framework import serializers
from rest_framework.fields import SerializerMethodField
from .models import Post
from users.serializers import UserSerializerMinimal
from django.shortcuts import reverse


class PostSerializer(serializers.ModelSerializer):
    queryset = Post.objects.order_by('-created_at')
    author = UserSerializerMinimal(read_only=True)
    replies_count = serializers.IntegerField(read_only=True)
    urls = serializers.SerializerMethodField()
    level = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = ['pk', 'parent', 'author', 'created_at', 'updated_at', 'active', 'text', 'meta',
                  'thumbs_up_array', 'thumbs_down_array', 'replies_count', 'urls', 'level']

        read_only_fields = ['pk', 'created_at', 'updated_at', 'thumbs_up_array', 'thumbs_down_array', 'urls', 'level']

    def get_urls(self, obj):
        return {
            'replies': reverse('discussion-viewset-replies', kwargs={'pk': obj.pk}),
            'detail': reverse('discussion-viewset-detail', kwargs={'pk': obj.pk}),
            'vote': reverse('discussion-viewset-vote', kwargs={'pk': obj.pk}),
        }


class PostSerializerWithReplies(PostSerializer):
    # this used only for displaying instances
    replies = serializers.SerializerMethodField()

    class Meta:
        max_replies_count = 3
        model = Post
        fields = PostSerializer.Meta.fields + ['replies']
        read_only_fields = PostSerializer.Meta.read_only_fields  + ['replies']

    def get_replies(self, obj):
        replies = self.Meta.model.objects.filter(parent=obj)[0:self.Meta.max_replies_count]
        return PostSerializer(replies, many=True).data
