from django.contrib import admin
from . import models


# Register your models here.

class ResourceInline(admin.TabularInline):
    model = models.CollectionResources


@admin.register(models.Collection)
class CollectionAdmin(admin.ModelAdmin):
    date_hierarchy = 'created_at'
    list_display = ('name', 'author', 'created_at')
    list_filter = ('created_at', 'tags', 'technologies')
    inlines = [ResourceInline, ]
