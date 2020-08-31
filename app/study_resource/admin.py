from django.contrib import admin
import study_resource.models as models
from django.urls import reverse
from simple_history.admin import SimpleHistoryAdmin


@admin.register(models.Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)


@admin.register(models.Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ('name', 'version', 'url')


@admin.register(models.StudyResource)
class StudyResourceAdmin(SimpleHistoryAdmin):
    date_hierarchy = 'created_at'
    list_display = ('name', 'publication_date', 'author', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at', 'tags', 'technologies')

    def view_on_site(self, obj):
        return reverse('detail', kwargs={'id': obj.id})


class ResourceInline(admin.TabularInline):
    model = models.CollectionResources


@admin.register(models.Collection)
class CollectionAdmin(admin.ModelAdmin):
    date_hierarchy = 'created_at'
    list_display = ('name', 'owner', 'created_at')
    list_filter = ('created_at', 'tags', 'technologies')
    inlines = [ResourceInline, ]


@admin.register(models.Review)
class ReviewAdmin(admin.ModelAdmin):
    date_hierarchy = 'created_at'
    list_display = ('study_resource', 'rating', 'created_at', 'author', 'thumbs_up', 'thumbs_down')
    list_filter = ('created_at',)
