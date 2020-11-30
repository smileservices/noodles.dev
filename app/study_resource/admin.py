from django.contrib import admin
import study_resource.models as models
from django.urls import reverse


@admin.register(models.StudyResource)
class StudyResourceAdmin(admin.ModelAdmin):
    date_hierarchy = 'created_at'
    list_display = ('name', 'publication_date', 'author', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at', 'tags', 'technologies')

    def view_on_site(self, obj):
        return reverse('detail', kwargs={'id': obj.id, 'slug': obj.slug})


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
