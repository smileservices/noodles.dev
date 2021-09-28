from django.contrib import admin
from . import models


@admin.register(models.ResourceHistoryModel)
class ResourceHistoryAdmin(admin.ModelAdmin):
    date_hierarchy = 'created'
    list_display = ('created','content_object', 'author', 'edit_published_by', 'edit_reason', 'operation_source', 'operation_type')